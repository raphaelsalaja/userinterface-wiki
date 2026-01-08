/**
 * Speech synthesis (TTS) - ElevenLabs integration
 *
 * Cost-saving strategies:
 * - Flash v2.5 model: 50% cheaper than Multilingual v2
 * - mp3_22050_32: smallest file size, low bandwidth
 * - Pre-generation only: no on-demand API calls
 * - Single voice: one great voice vs many
 * - Paragraph-level caching: only regenerate changed paragraphs
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
const CACHE_PREFIX = "tts-v2"; // New prefix for paragraph-level cache
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";
const MODEL_ID = "eleven_flash_v2_5";
const OUTPUT_FORMAT = "mp3_22050_32";

// Minimum paragraph length to avoid tiny API calls
const MIN_PARAGRAPH_LENGTH = 50;

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

/**
 * Split article text into paragraphs for incremental caching
 */
export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= MIN_PARAGRAPH_LENGTH);
}

/**
 * Get paragraphs with their hashes for cache checking
 */
export interface ParagraphInfo {
  index: number;
  text: string;
  hash: string;
  characters: number;
}

export function analyzeParagraphs(text: string): ParagraphInfo[] {
  const paragraphs = splitIntoParagraphs(text);
  return paragraphs.map((text, index) => ({
    index,
    text,
    hash: hashContent(text),
    characters: text.length,
  }));
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
  return (
    value
      // Code blocks
      .replace(/```[\s\S]*?```/g, "")
      .replace(/~~~[\s\S]*?~~~/g, "")
      .replace(/`[^`]*`/g, "")
      .replace(/<pre[\s\S]*?<\/pre>/gi, "")
      // Footnotes
      .replace(/^\[\^[^\]]+\]:.*$/gm, "")
      .replace(/\[\^[^\]]+\]/g, "")
      // JSX components (demos, figures, callouts, etc.)
      .replace(/<(Figure|Caption|Callout|Note|Warning|Tip)[\s\S]*?<\/\1>/gi, "")
      .replace(/<[A-Z][a-zA-Z]*\s*\/>/g, "")
      .replace(/<\/?[a-zA-Z][^>]*>/g, "")
      // Markdown links - keep text, remove URL
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // URLs (raw links in text)
      .replace(/https?:\/\/[^\s)>\]]+/g, "")
      // Image references
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      // Import/export statements in MDX (including multi-line)
      .replace(/^import\s*\{[\s\S]*?\}\s*from\s*["'][^"']+["'];?/gm, "")
      .replace(/^import\s+\w+\s+from\s+["'][^"']+["'];?/gm, "")
      .replace(/^import\s+["'][^"']+["'];?/gm, "")
      .replace(/^export\s+(default\s+)?\{[\s\S]*?\};?/gm, "")
      .replace(/^export\s+.*$/gm, "")
      // Horizontal rules
      .replace(/^---+$/gm, "")
      .replace(/^\*\*\*+$/gm, "")
      // Repeated punctuation
      .replace(/\.{2,}/g, ".")
      .replace(/!{2,}/g, "!")
      .replace(/\?{2,}/g, "?")
      // Multiple spaces
      .replace(/[ \t]+/g, " ")
      // Multiple newlines
      .replace(/\n{3,}/g, "\n\n")
      // Trim each line
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim()
  );
}

// -----------------------------------------------------------------------------
// Cache (Vercel Blob) - Paragraph-level
// -----------------------------------------------------------------------------

export interface CacheKey {
  base: string;
  hash: string;
}

export interface ParagraphCacheKey {
  slug: string;
  paragraphHash: string;
  audioPath: string;
  jsonPath: string;
}

/**
 * Build cache key for a single paragraph
 */
export function buildParagraphCacheKey(
  slugSegments: string[],
  paragraphHash: string,
): ParagraphCacheKey {
  const slug = slugSegments.join("__");
  const base = `${CACHE_PREFIX}/${slug}/p_${paragraphHash}`;
  return {
    slug,
    paragraphHash,
    audioPath: `${base}.mp3`,
    jsonPath: `${base}.json`,
  };
}

/**
 * Build manifest cache key for a document (stores paragraph order)
 */
export function buildManifestCacheKey(
  slugSegments: string[],
  paragraphHashes: string[],
): CacheKey {
  const slug = slugSegments.join("__");
  const manifestHash = hashContent(paragraphHashes.join("|"));
  return {
    base: `${CACHE_PREFIX}/${slug}/manifest_${manifestHash}`,
    hash: manifestHash,
  };
}

// Legacy function for backwards compatibility
export function buildCacheKey(slugSegments: string[], text: string): CacheKey {
  const contentHash = hashContent(text);
  const base = `${CACHE_PREFIX}/${slugSegments.join("__")}/${contentHash}`;
  return { base, hash: contentHash };
}

/**
 * Check if a paragraph is cached
 */
export async function isParagraphCached(
  key: ParagraphCacheKey,
): Promise<boolean> {
  const audioMeta = await safeHead(key.audioPath);
  const jsonMeta = await safeHead(key.jsonPath);
  return !!(audioMeta && jsonMeta);
}

/**
 * Read a single paragraph from cache
 */
export async function readParagraphFromCache(key: ParagraphCacheKey): Promise<{
  audioBuffer: Buffer;
  timestamps: WordTimestamp[];
} | null> {
  const audioMeta = await safeHead(key.audioPath);
  const jsonMeta = await safeHead(key.jsonPath);

  if (!audioMeta || !jsonMeta) return null;

  const [audioResponse, timestamps] = await Promise.all([
    fetch(audioMeta.url),
    fetch(jsonMeta.url).then((res) => res.json()) as Promise<WordTimestamp[]>,
  ]);

  const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
  return { audioBuffer, timestamps };
}

/**
 * Write a single paragraph to cache
 */
export async function writeParagraphToCache(
  key: ParagraphCacheKey,
  data: { audioBuffer: Buffer; timestamps: WordTimestamp[] },
): Promise<void> {
  await Promise.all([
    uploadBinary(key.audioPath, data.audioBuffer, "audio/mpeg"),
    uploadJson(key.jsonPath, data.timestamps),
  ]);
}

/**
 * Read full document from paragraph cache (combines all paragraphs)
 */
export async function readDocumentFromCache(
  slugSegments: string[],
  paragraphs: ParagraphInfo[],
): Promise<{ audioUrl: string; timestamps: WordTimestamp[] } | null> {
  // Check if all paragraphs are cached
  const cacheKeys = paragraphs.map((p) =>
    buildParagraphCacheKey(slugSegments, p.hash),
  );

  const cachedFlags = await Promise.all(cacheKeys.map(isParagraphCached));
  if (!cachedFlags.every(Boolean)) return null;

  // All cached - read and combine
  const paragraphData = await Promise.all(
    cacheKeys.map(readParagraphFromCache),
  );

  // Filter out any nulls (shouldn't happen since we checked, but be safe)
  const validData = paragraphData.filter(
    (d): d is NonNullable<typeof d> => d !== null,
  );
  if (validData.length !== paragraphData.length) return null;

  // Combine audio buffers
  const audioBuffers = validData.map((d) => d.audioBuffer);
  const combinedAudio = concatenateMP3Buffers(audioBuffers);

  // Combine timestamps with offset
  const combinedTimestamps = combineTimestamps(
    validData.map((d) => d.timestamps),
    audioBuffers,
  );

  // Upload combined result (allow overwrite since manifest hash is content-based)
  const manifestKey = buildManifestCacheKey(
    slugSegments,
    paragraphs.map((p) => p.hash),
  );
  const audioUrl = await uploadBinary(
    `${manifestKey.base}.mp3`,
    combinedAudio,
    "audio/mpeg",
    true, // allowOverwrite
  );
  await uploadJson(`${manifestKey.base}.json`, combinedTimestamps, true);

  return { audioUrl, timestamps: combinedTimestamps };
}

// Legacy read function
export async function readFromCache(key: CacheKey) {
  const audioMeta = await safeHead(`${key.base}.mp3`);
  const jsonMeta = await safeHead(`${key.base}.json`);

  if (!audioMeta || !jsonMeta) return null;

  const timestamps = (await fetch(jsonMeta.url).then((res) =>
    res.json(),
  )) as WordTimestamp[];

  return { audioUrl: audioMeta.url, timestamps };
}

// Legacy write function
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

/**
 * Concatenate MP3 buffers (simple concatenation works for same-format MP3s)
 */
function concatenateMP3Buffers(buffers: Buffer[]): Buffer {
  return Buffer.concat(buffers);
}

/**
 * Combine timestamps from multiple paragraphs with time offsets
 */
function combineTimestamps(
  paragraphTimestamps: WordTimestamp[][],
  audioBuffers: Buffer[],
): WordTimestamp[] {
  const combined: WordTimestamp[] = [];
  let timeOffset = 0;

  for (let i = 0; i < paragraphTimestamps.length; i++) {
    const timestamps = paragraphTimestamps[i];

    // Add timestamps with offset
    for (const ts of timestamps) {
      combined.push({
        ...ts,
        start: ts.start + timeOffset,
        end: ts.end + timeOffset,
      });
    }

    // Estimate duration from last timestamp or audio buffer size
    if (timestamps.length > 0) {
      const lastTs = timestamps[timestamps.length - 1];
      // Add small gap between paragraphs (0.3s)
      timeOffset = lastTs.end + 0.3;
    } else {
      // Fallback: estimate from buffer size (rough approximation for 22kHz 32kbps)
      const durationEstimate = (audioBuffers[i].length * 8) / 32000;
      timeOffset += durationEstimate + 0.3;
    }
  }

  return combined;
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
  allowOverwrite = false,
) {
  const result = (await put(pathname, data, {
    access: "public",
    contentType,
    addRandomSuffix: !allowOverwrite,
    allowOverwrite,
  })) as PutBlobResult;
  return result.url;
}

async function uploadJson(
  pathname: string,
  payload: unknown,
  allowOverwrite = false,
) {
  const buffer = Buffer.from(JSON.stringify(payload));
  await put(pathname, buffer, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: !allowOverwrite,
    allowOverwrite,
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
