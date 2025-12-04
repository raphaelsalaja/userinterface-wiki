import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PutBlobResult } from "@vercel/blob";
import { head, put } from "@vercel/blob";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import removeMarkdown from "remove-markdown";
import { normalizeWord } from "@/lib/text/normalize-word";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_DIR = path.join(process.cwd(), "markdown", "content");
const CACHE_PREFIX = "tts";
const STANDARD_VOICE_FALLBACK = "onwK4e9ZLuTAKqWW03F9";
const DEFAULT_MODEL_ID = "eleven_flash_v2";

class ArticleNotFoundError extends Error {}

class ResponseError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  normalized: string;
}

type NumericSeries = Array<number | string | null | undefined>;

interface ElevenLabsAlignment {
  words?: string[];
  word_start_times_seconds?: NumericSeries;
  word_end_times_seconds?: NumericSeries;
  word_start_times_ms?: NumericSeries;
  word_end_times_ms?: NumericSeries;
  word_start_times?: NumericSeries;
  word_end_times?: NumericSeries;
  characters?: string[];
  character_start_times_seconds?: NumericSeries;
  character_end_times_seconds?: NumericSeries;
  character_start_times_ms?: NumericSeries;
  character_end_times_ms?: NumericSeries;
  char_start_times_seconds?: NumericSeries;
  char_end_times_seconds?: NumericSeries;
  char_start_times_ms?: NumericSeries;
  char_end_times_ms?: NumericSeries;
}

interface ElevenLabsResponse {
  audio_base64?: string;
  alignment?: ElevenLabsAlignment;
  normalized_alignment?: ElevenLabsAlignment;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => ({}));
    const slugSegments = toSlugSegments(payload.slug);
    const slugKey = slugSegments.join("/");
    const logPrefix = `[tts:${slugKey || "unknown"}]`;

    if (!slugSegments.length) {
      return NextResponse.json(
        { error: "Missing article slug" },
        { status: 400 },
      );
    }

    const plainText = await loadArticle(slugSegments).catch((error) => {
      if (error instanceof ArticleNotFoundError) {
        throw new ResponseError("Article not found", 404);
      }
      throw error;
    });
    const voiceId = resolveVoiceId(payload.voiceId);
    const modelId = resolveModelId(payload.modelId);
    const contentHash = hashContent(`${plainText}::${voiceId}::${modelId}`);
    const cacheBase = `${CACHE_PREFIX}/${slugSegments.join("__")}/${contentHash}`;

    console.info(logPrefix, "request", {
      voiceId,
      modelId,
      hash: contentHash,
      textLength: plainText.length,
    });

    const cached = await readFromCache(cacheBase);
    if (cached) {
      console.info(logPrefix, "cache-hit", {
        hash: contentHash,
        audioUrl: cached.audioUrl,
        timestamps: cached.timestamps.length,
      });
      return NextResponse.json({ ...cached, hash: contentHash });
    }

    console.info(logPrefix, "cache-miss", {
      hash: contentHash,
      voiceId,
      modelId,
    });

    const synthesized = await synthesizeSpeech(plainText, voiceId, modelId);

    console.info(logPrefix, "synthesized", {
      voiceId,
      modelId,
      hash: contentHash,
      timestampCount: synthesized.timestamps.length,
      audioBytes: synthesized.audioBuffer.length,
    });

    const [audioUrl] = await Promise.all([
      uploadBinary(`${cacheBase}.mp3`, synthesized.audioBuffer, "audio/mpeg"),
      uploadJson(`${cacheBase}.json`, synthesized.timestamps),
    ]);

    console.info(logPrefix, "uploaded", {
      hash: contentHash,
      audioUrl,
      timestampCount: synthesized.timestamps.length,
    });

    return NextResponse.json({
      audioUrl,
      timestamps: synthesized.timestamps,
      hash: contentHash,
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("[tts]", error);
    return NextResponse.json(
      { error: "Unable to generate narration" },
      { status: 500 },
    );
  }
}

async function readFromCache(cacheBase: string) {
  const audioMeta = await safeHead(`${cacheBase}.mp3`);
  const jsonMeta = await safeHead(`${cacheBase}.json`);

  if (!audioMeta || !jsonMeta) return null;

  const timestamps = (await fetch(jsonMeta.url).then((res) =>
    res.json(),
  )) as WordTimestamp[];

  return {
    audioUrl: audioMeta.url,
    timestamps,
  };
}

async function synthesizeSpeech(
  text: string,
  voiceId: string,
  modelId: string,
) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  const endpoint = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
  );
  endpoint.searchParams.set("enable_logging", "true");
  endpoint.searchParams.set("output_format", "mp3_44100_128");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `ElevenLabs request failed: ${response.status} - ${message}`,
    );
  }

  const data = (await response.json()) as ElevenLabsResponse;

  if (!data.audio_base64) {
    throw new Error("ElevenLabs response missing audio data");
  }

  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  let timestamps = buildWordTimestamps(data.alignment);

  if (!timestamps.length) {
    timestamps = buildWordTimestamps(data.normalized_alignment);
  }

  return { audioBuffer, timestamps };
}

function buildWordTimestamps(alignment?: ElevenLabsAlignment): WordTimestamp[] {
  if (!alignment) return [];

  const fromWords = buildFromWordSeries(alignment);
  if (fromWords.length) {
    return fromWords;
  }

  const fromCharacters = buildFromCharacterSeries(alignment);
  if (fromCharacters.length) {
    return fromCharacters;
  }

  return [];
}

function buildFromWordSeries(alignment: ElevenLabsAlignment): WordTimestamp[] {
  if (!alignment.words?.length) return [];

  const startSeries =
    alignment.word_start_times_seconds ??
    alignment.word_start_times_ms ??
    alignment.word_start_times ??
    [];
  const endSeries =
    alignment.word_end_times_seconds ??
    alignment.word_end_times_ms ??
    alignment.word_end_times ??
    [];

  return alignment.words
    .map((word, index) => {
      const start = normalizeTimestampValue(startSeries[index]);
      const end = normalizeTimestampValue(
        endSeries[index] ?? startSeries[index],
      );
      const normalized = normalizeWord(word ?? "");
      if (!word || !normalized || start === null || end === null) {
        return null;
      }
      return {
        word,
        start,
        end,
        normalized,
      } satisfies WordTimestamp;
    })
    .filter(Boolean) as WordTimestamp[];
}

interface CharacterEntry {
  character: string;
  start: number | null;
  end: number | null;
}

function buildFromCharacterSeries(
  alignment: ElevenLabsAlignment,
): WordTimestamp[] {
  if (!alignment.characters?.length) return [];

  const startSeries =
    alignment.character_start_times_seconds ??
    alignment.char_start_times_seconds ??
    alignment.character_start_times_ms ??
    alignment.char_start_times_ms ??
    [];
  const endSeries =
    alignment.character_end_times_seconds ??
    alignment.char_end_times_seconds ??
    alignment.character_end_times_ms ??
    alignment.char_end_times_ms ??
    [];

  const entries: CharacterEntry[] = alignment.characters.map(
    (character, index) => ({
      character,
      start: normalizeTimestampValue(startSeries[index]),
      end: normalizeTimestampValue(endSeries[index] ?? startSeries[index]),
    }),
  );

  const results: WordTimestamp[] = [];
  let buffer = "";
  let startTime: number | null = null;
  let lastCharacterEnd: number | null = null;

  entries.forEach((entry) => {
    const { character, start, end } = entry;
    const isWhitespace = !character || !character.trim();

    if (!isWhitespace) {
      buffer += character;
      if (startTime === null && typeof start === "number") {
        startTime = start;
      }
      if (typeof end === "number") {
        lastCharacterEnd = end;
      }
    }

    if (isWhitespace) {
      if (buffer.trim() && startTime !== null) {
        const normalized = normalizeWord(buffer);
        if (normalized) {
          results.push({
            word: buffer,
            start: startTime,
            end: lastCharacterEnd ?? startTime,
            normalized,
          });
        }
      }
      buffer = "";
      startTime = null;
      lastCharacterEnd = null;
      return;
    }
  });

  if (buffer.trim() && startTime !== null) {
    const normalized = normalizeWord(buffer);
    if (normalized) {
      results.push({
        word: buffer,
        start: startTime,
        end: lastCharacterEnd ?? startTime,
        normalized,
      });
    }
  }

  return results;
}

async function loadArticle(slugSegments: string[]) {
  const articlePath = resolveArticlePath(slugSegments);
  const raw = await readFile(articlePath, "utf8").catch((error: unknown) => {
    if (isEnoent(error)) throw new ArticleNotFoundError();
    throw error;
  });
  const body = stripFrontmatter(raw);
  const spokenSource = stripCodeSections(body);
  return removeMarkdown(spokenSource, { useImgAltText: false }).trim();
}

function isEnoent(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      (error as { code?: string }).code === "ENOENT",
  );
}

function stripFrontmatter(value: string) {
  if (!value.startsWith("---")) return value;
  const closingIndex = value.indexOf("\n---", 3);
  if (closingIndex === -1) return value;
  return value.slice(closingIndex + 4);
}

function resolveArticlePath(slugSegments: string[]) {
  const relativePath = `${path.join(...slugSegments)}.mdx`;
  const absolute = path.join(CONTENT_DIR, relativePath);
  if (!absolute.startsWith(CONTENT_DIR)) {
    throw new Error("Invalid slug path");
  }
  return absolute;
}

function hashContent(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function toSlugSegments(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((segment) => normalizeSegment(segment))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("/")
      .flatMap((segment) => normalizeSegment(segment))
      .filter(Boolean);
  }

  return [];
}

function normalizeSegment(value: unknown) {
  if (typeof value !== "string") return [];
  const cleaned = value.trim();
  if (!cleaned) return [];
  if (!/^[-A-Za-z0-9]+$/.test(cleaned)) return [];
  return [cleaned];
}

async function safeHead(pathname: string) {
  try {
    return await head(pathname);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

function isNotFound(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: number }).status;
  if (status === 404) return true;
  const code = (error as { code?: string }).code;
  if (code === "item_not_found") return true;
  const message = (error as { message?: string }).message ?? "";
  return message.toLowerCase().includes("does not exist");
}

function normalizeTimestampValue(value?: number | string | null) {
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    value = Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (value > 1000) {
    return value / 1000;
  }

  return value;
}

function resolveVoiceId(requested?: unknown) {
  if (typeof requested === "string" && requested.trim()) {
    return requested.trim();
  }

  if (process.env.ELEVENLABS_STANDARD_VOICE_ID?.trim()) {
    return process.env.ELEVENLABS_STANDARD_VOICE_ID.trim();
  }

  return STANDARD_VOICE_FALLBACK;
}

function stripCodeSections(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<pre[\s\S]*?<\/pre>/gi, "");
}

function resolveModelId(requested?: unknown) {
  if (typeof requested === "string" && requested.trim()) {
    return requested.trim();
  }

  if (process.env.ELEVENLABS_MODEL_ID?.trim()) {
    return process.env.ELEVENLABS_MODEL_ID.trim();
  }

  return DEFAULT_MODEL_ID;
}

async function uploadBinary(
  pathname: string,
  data: Buffer,
  contentType: string,
) {
  const result = (await put(pathname, data, {
    access: "public",
    contentType,
  })) as PutBlobResult;

  return result.url;
}

async function uploadJson(pathname: string, payload: unknown) {
  const buffer = Buffer.from(JSON.stringify(payload));
  await put(pathname, buffer, {
    access: "public",
    contentType: "application/json",
  });
}
