/**
 * Speech synthesis (TTS) - ElevenLabs integration
 *
 * Cost-saving strategies:
 * - Flash v2.5 model: 50% cheaper than Multilingual v2
 * - mp3_22050_32: smallest file size, low bandwidth
 * - Pre-generation only: no on-demand API calls
 * - Single voice: one great voice vs many
 */

import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PutBlobResult } from "@vercel/blob";
import { head, put } from "@vercel/blob";
import removeMarkdown from "remove-markdown";
import { ArticleNotFoundError, isEnoent, isNotFound } from "./errors";
import { normalizeWord } from "./strings";
import type { WordTimestamp } from "./types";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content");
const CACHE_PREFIX = "tts";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";
const MODEL_ID = "eleven_flash_v2_5";
const OUTPUT_FORMAT = "mp3_22050_32";

// -----------------------------------------------------------------------------
// Article Text Extraction
// -----------------------------------------------------------------------------

export async function getPlainArticleText(slugSegments: string[]) {
  const articlePath = resolveArticlePath(slugSegments);
  const raw = await readFile(articlePath, "utf8").catch((error) => {
    if (isEnoent(error)) throw new ArticleNotFoundError();
    throw error;
  });

  const body = stripFrontmatter(raw);
  const spokenSource = stripCodeSections(body);
  return removeMarkdown(spokenSource, { useImgAltText: false }).trim();
}

export function resolveArticlePath(slugSegments: string[]) {
  const slug = slugSegments.join("/");
  const absolute = path.join(CONTENT_DIR, slug, "index.mdx");
  const rel = path.relative(CONTENT_DIR, absolute);

  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Invalid slug path");
  }

  return absolute;
}

function stripFrontmatter(value: string) {
  if (!value.startsWith("---")) return value;
  const closingIndex = value.indexOf("\n---", 3);
  if (closingIndex === -1) return value;
  return value.slice(closingIndex + 4);
}

function stripCodeSections(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<pre[\s\S]*?<\/pre>/gi, "")
    .replace(/^\[\^[^\]]+\]:.*$/gm, "")
    .replace(/\[\^[^\]]+\]/g, "")
    .replace(/<(Figure|Caption|Callout|Note|Warning|Tip)[\s\S]*?<\/\1>/gi, "")
    .replace(/<[A-Z][a-zA-Z]*\s*\/>/g, "")
    .replace(/<\/?[a-zA-Z][^>]*>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n");
}

// -----------------------------------------------------------------------------
// Cache (Vercel Blob)
// -----------------------------------------------------------------------------

export interface CacheKey {
  base: string;
  hash: string;
}

export function buildCacheKey(slugSegments: string[], text: string): CacheKey {
  const contentHash = hashContent(text);
  const base = `${CACHE_PREFIX}/${slugSegments.join("__")}/${contentHash}`;
  return { base, hash: contentHash };
}

export async function readFromCache(key: CacheKey) {
  const audioMeta = await safeHead(`${key.base}.mp3`);
  const jsonMeta = await safeHead(`${key.base}.json`);

  if (!audioMeta || !jsonMeta) return null;

  const timestamps = (await fetch(jsonMeta.url).then((res) =>
    res.json(),
  )) as WordTimestamp[];

  return { audioUrl: audioMeta.url, timestamps };
}

export async function writeToCache(
  key: CacheKey,
  synthesized: { audioBuffer: Buffer; timestamps: WordTimestamp[] },
) {
  const [audioUrl] = await Promise.all([
    uploadBinary(`${key.base}.mp3`, synthesized.audioBuffer, "audio/mpeg"),
    uploadJson(`${key.base}.json`, synthesized.timestamps),
  ]);
  return audioUrl;
}

function hashContent(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

async function safeHead(pathname: string) {
  try {
    return await head(pathname);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
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

// -----------------------------------------------------------------------------
// ElevenLabs API
// -----------------------------------------------------------------------------

interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
}

interface ElevenLabsTimestampResponse {
  audio_base64: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  } | null;
  normalized_alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  } | null;
}

function getConfig(): ElevenLabsConfig {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }
  if (!voiceId) {
    throw new Error("ELEVENLABS_VOICE_ID environment variable is not set");
  }

  return { apiKey, voiceId };
}

/**
 * Convert character-level timestamps to word-level timestamps
 */
function alignmentToWordTimestamps(
  alignment: ElevenLabsTimestampResponse["alignment"],
  originalText: string,
): WordTimestamp[] {
  if (!alignment) {
    return createEstimatedTimestamps(originalText);
  }

  const {
    characters,
    character_start_times_seconds,
    character_end_times_seconds,
  } = alignment;
  const timestamps: WordTimestamp[] = [];

  let wordStart = -1;
  let wordEnd = -1;
  let currentWord = "";

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startTime = character_start_times_seconds[i];
    const endTime = character_end_times_seconds[i];

    const isWordBoundary = /[\s.,!?;:'"()[\]{}\-—–]/.test(char);

    if (isWordBoundary) {
      if (currentWord.length > 0 && wordStart >= 0) {
        const normalized = normalizeWord(currentWord);
        if (normalized) {
          timestamps.push({
            word: currentWord,
            start: wordStart,
            end: wordEnd,
            normalized,
          });
        }
      }
      currentWord = "";
      wordStart = -1;
      wordEnd = -1;
    } else {
      if (wordStart < 0) {
        wordStart = startTime;
      }
      wordEnd = endTime;
      currentWord += char;
    }
  }

  if (currentWord.length > 0 && wordStart >= 0) {
    const normalized = normalizeWord(currentWord);
    if (normalized) {
      timestamps.push({
        word: currentWord,
        start: wordStart,
        end: wordEnd,
        normalized,
      });
    }
  }

  return timestamps;
}

function createEstimatedTimestamps(text: string): WordTimestamp[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const wordsPerSecond = 150 / 60;
  const avgWordDuration = 1 / wordsPerSecond;

  const timestamps: WordTimestamp[] = [];
  let currentTime = 0;

  for (const word of words) {
    const normalized = normalizeWord(word);
    if (!normalized) continue;

    const duration = avgWordDuration * (word.length / 5);

    timestamps.push({
      word,
      start: currentTime,
      end: currentTime + duration,
      normalized,
    });

    currentTime += duration;
  }

  return timestamps;
}

/**
 * Synthesize speech using ElevenLabs API with timestamps
 */
export async function synthesizeSpeech(
  text: string,
): Promise<{ audioBuffer: Buffer; timestamps: WordTimestamp[] }> {
  const config = getConfig();

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${config.voiceId}/with-timestamps?output_format=${OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(
      `ElevenLabs API error: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const data = (await response.json()) as ElevenLabsTimestampResponse;

  const audioBuffer = Buffer.from(data.audio_base64, "base64");

  const timestamps = alignmentToWordTimestamps(
    data.normalized_alignment ?? data.alignment,
    text,
  );

  return { audioBuffer, timestamps };
}

/**
 * Get available quota information
 */
export async function getQuotaInfo(): Promise<{
  characterCount: number;
  characterLimit: number;
  remainingCharacters: number;
}> {
  const config = getConfig();

  const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
    headers: {
      "xi-api-key": config.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get quota info: ${response.status}`);
  }

  const data = await response.json();
  return {
    characterCount: data.character_count ?? 0,
    characterLimit: data.character_limit ?? 0,
    remainingCharacters:
      (data.character_limit ?? 0) - (data.character_count ?? 0),
  };
}
