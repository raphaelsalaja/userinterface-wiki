import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PutBlobResult } from "@vercel/blob";
import { head, list, put } from "@vercel/blob";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { ArticleNotFoundError, isEnoent, isNotFound } from "./errors";

/** Character-level alignment data from ElevenLabs with-timestamps API */
export interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

/** Result from speech synthesis with timestamps */
export interface SpeechResult {
  audioBuffer: Buffer;
  alignment: Alignment;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const CACHE_PREFIX = "audio-transcripts";
const MODEL_ID = "eleven_turbo_v2_5";
const OUTPUT_FORMAT = "mp3_22050_32";
const MIN_PARAGRAPH_LENGTH = 100;
const MAX_PARAGRAPH_LENGTH = 2500;
const TARGET_BATCH_LENGTH = 1000;

/** Extracts plain speakable text from an article given its slug segments. */
export async function getPlainArticleText(slugSegments: string[]) {
  const articlePath = resolveArticlePath(slugSegments);
  const raw = await readFile(articlePath, "utf8").catch((error) => {
    if (isEnoent(error)) throw new ArticleNotFoundError();
    throw error;
  });

  return mdxToSpeakableText(raw);
}

const DROP_TYPES = new Set([
  "mdxjsEsm",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxFlowExpression",
  "mdxTextExpression",
  "yaml",
  "toml",
  "code",
  "inlineCode",
  "html",
  "image",
  "imageReference",
  "footnoteDefinition",
  "footnoteReference",
  "thematicBreak",
]);

/** Strips non-speakable nodes from an AST tree using filter. */
// biome-ignore lint/suspicious/noExplicitAny: AST nodes have dynamic structure
function stripNonSpeakable(tree: any): void {
  visit(tree, (node) => {
    if (!node.children || !Array.isArray(node.children)) return;
    node.children = node.children.filter(
      // biome-ignore lint/suspicious/noExplicitAny: AST child nodes have dynamic structure
      (child: any) => !DROP_TYPES.has(child.type),
    );
  });
}

/** Converts MDX to speakable plain text using proper AST parsing. */
function mdxToSpeakableText(mdx: string): string {
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .parse(mdx);

  stripNonSpeakable(tree);

  return mdastToString(tree)
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Splits article text into paragraphs for incremental caching, merging small paragraphs to reduce API call overhead. */
function splitIntoParagraphs(text: string): string[] {
  const parts = text
    .split(/\n{2,}/)
    .map((p) => optimizeTextForTTS(p.trim()))
    .filter(Boolean);

  const out: string[] = [];
  let buf = "";

  const flush = () => {
    if (buf.trim().length >= MIN_PARAGRAPH_LENGTH) out.push(buf.trim());
    buf = "";
  };

  for (const p of parts) {
    // Hard-split oversized paragraphs
    if (p.length > MAX_PARAGRAPH_LENGTH) {
      flush();
      for (let i = 0; i < p.length; i += MAX_PARAGRAPH_LENGTH) {
        const chunk = p.slice(i, i + MAX_PARAGRAPH_LENGTH).trim();
        if (chunk) out.push(chunk);
      }
      continue;
    }

    if (!buf) {
      buf = p;
      continue;
    }

    const candidate = `${buf} ${p}`;
    if (candidate.length <= TARGET_BATCH_LENGTH) {
      buf = candidate;
      continue;
    }

    flush();
    buf = p;
  }

  flush();
  return out;
}

/** Returns paragraphs with their hashes for cache checking. */
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

function resolveArticlePath(slugSegments: string[]) {
  const slug = slugSegments.join("/");
  const absolute = path.join(CONTENT_DIR, slug, "index.mdx");
  const rel = path.relative(CONTENT_DIR, absolute);

  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Invalid slug path");
  }

  return absolute;
}

/** Optimizes text to reduce character count without changing speech output. */
function optimizeTextForTTS(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, "")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/!{2,}/g, "!")
    .replace(/\?{2,}/g, "?")
    .replace(/\s*\([^)]{0,20}\)\s*/g, " ")
    .trim();
}

export interface ParagraphCacheKey {
  slug: string;
  paragraphHash: string;
  audioPath: string;
  alignmentPath: string;
}

/** Builds cache key for a single paragraph. */
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
    alignmentPath: `${base}.json`,
  };
}

/** Builds manifest cache key for a document (stores paragraph order). */
function buildManifestCacheKey(
  slugSegments: string[],
  paragraphHashes: string[],
): { base: string; hash: string } {
  const slug = slugSegments.join("__");
  const manifestHash = hashContent(paragraphHashes.join("|"));
  return {
    base: `${CACHE_PREFIX}/${slug}/manifest_${manifestHash}`,
    hash: manifestHash,
  };
}

/** Finds a blob by prefix (handles legacy blobs with random suffixes). */
async function findBlobByPrefix(
  prefix: string,
  extension: string,
): Promise<{ url: string; pathname: string } | null> {
  // First try exact path (new format without random suffix)
  const exactPath = `${prefix}${extension}`;
  const exactMeta = await safeHead(exactPath);
  if (exactMeta) {
    return { url: exactMeta.url, pathname: exactMeta.pathname };
  }

  // Fall back to prefix search (legacy format with random suffix)
  try {
    const result = await list({ prefix });
    const matching = result.blobs.find((b) => b.pathname.endsWith(extension));
    if (matching) {
      return { url: matching.url, pathname: matching.pathname };
    }
  } catch {
    // Ignore list errors
  }

  return null;
}

/** Checks if a paragraph is cached (both audio and alignment). */
export async function isParagraphCached(
  key: ParagraphCacheKey,
): Promise<boolean> {
  // Extract base path without extension
  const audioBase = key.audioPath.replace(/\.mp3$/, "");
  const alignmentBase = key.alignmentPath.replace(/\.json$/, "");

  const [audioMeta, alignmentMeta] = await Promise.all([
    findBlobByPrefix(audioBase, ".mp3"),
    findBlobByPrefix(alignmentBase, ".json"),
  ]);
  return !!audioMeta && !!alignmentMeta;
}

/** Reads a single paragraph from cache (audio and alignment). */
async function readParagraphFromCache(
  key: ParagraphCacheKey,
): Promise<{ audioBuffer: Buffer; alignment: Alignment } | null> {
  // Extract base path without extension
  const audioBase = key.audioPath.replace(/\.mp3$/, "");
  const alignmentBase = key.alignmentPath.replace(/\.json$/, "");

  const [audioMeta, alignmentMeta] = await Promise.all([
    findBlobByPrefix(audioBase, ".mp3"),
    findBlobByPrefix(alignmentBase, ".json"),
  ]);
  if (!audioMeta || !alignmentMeta) return null;

  const [audioResponse, alignmentResponse] = await Promise.all([
    fetch(audioMeta.url),
    fetch(alignmentMeta.url),
  ]);

  const [audioBuffer, alignment] = await Promise.all([
    audioResponse.arrayBuffer().then((ab) => Buffer.from(ab)),
    alignmentResponse.json() as Promise<Alignment>,
  ]);

  return { audioBuffer, alignment };
}

/** Writes a single paragraph to cache (audio and alignment). */
export async function writeParagraphToCache(
  key: ParagraphCacheKey,
  audioBuffer: Buffer,
  alignment: Alignment,
): Promise<void> {
  await Promise.all([
    uploadBinary(key.audioPath, audioBuffer, "audio/mpeg", true),
    uploadJson(key.alignmentPath, alignment, true),
  ]);
}

/** Reads full document from paragraph cache (combines all paragraphs). */
export async function readDocumentFromCache(
  slugSegments: string[],
  paragraphs: ParagraphInfo[],
): Promise<{ audioUrl: string; alignment: Alignment } | null> {
  // Check if all paragraphs are cached
  const cacheKeys = paragraphs.map((p) =>
    buildParagraphCacheKey(slugSegments, p.hash),
  );

  const cachedFlags = await Promise.all(cacheKeys.map(isParagraphCached));
  if (!cachedFlags.every(Boolean)) return null;

  // All cached - read and combine
  const cachedParagraphs = await Promise.all(
    cacheKeys.map(readParagraphFromCache),
  );

  // Filter out any nulls (shouldn't happen since we checked, but be safe)
  const validParagraphs = cachedParagraphs.filter(
    (p): p is { audioBuffer: Buffer; alignment: Alignment } => p !== null,
  );
  if (validParagraphs.length !== cachedParagraphs.length) return null;

  // Combine audio buffers
  const combinedAudio = Buffer.concat(
    validParagraphs.map((p) => p.audioBuffer),
  );

  // Combine alignments (adjust timestamps for each paragraph)
  const combinedAlignment = combineAlignments(
    validParagraphs.map((p) => p.alignment),
  );

  // Upload combined result (allow overwrite since manifest hash is content-based)
  const manifestKey = buildManifestCacheKey(
    slugSegments,
    paragraphs.map((p) => p.hash),
  );

  const [audioUrl] = await Promise.all([
    uploadBinary(`${manifestKey.base}.mp3`, combinedAudio, "audio/mpeg", true),
    uploadJson(`${manifestKey.base}.json`, combinedAlignment, true),
  ]);

  return { audioUrl, alignment: combinedAlignment };
}

/** Combines multiple alignment objects, adjusting timestamps sequentially. */
function combineAlignments(alignments: Alignment[]): Alignment {
  const combined: Alignment = {
    characters: [],
    character_start_times_seconds: [],
    character_end_times_seconds: [],
  };

  let timeOffset = 0;

  for (const alignment of alignments) {
    // Add characters
    combined.characters.push(...alignment.characters);

    // Add timestamps with offset
    for (const startTime of alignment.character_start_times_seconds) {
      combined.character_start_times_seconds.push(startTime + timeOffset);
    }
    for (const endTime of alignment.character_end_times_seconds) {
      combined.character_end_times_seconds.push(endTime + timeOffset);
    }

    // Update offset for next paragraph (use last end time)
    if (alignment.character_end_times_seconds.length > 0) {
      const lastEndTime =
        alignment.character_end_times_seconds[
          alignment.character_end_times_seconds.length - 1
        ];
      timeOffset += lastEndTime;
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
  data: unknown,
  allowOverwrite = false,
) {
  const json = JSON.stringify(data);
  const result = (await put(pathname, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: !allowOverwrite,
    allowOverwrite,
  })) as PutBlobResult;
  return result.url;
}

/** Synthesizes speech with character-level timestamps using ElevenLabs REST API. */
export async function synthesizeSpeech(text: string): Promise<SpeechResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!voiceId) {
    throw new Error("ELEVENLABS_VOICE_ID environment variable is not set");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        output_format: OUTPUT_FORMAT,
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
    const errorText = await response.text();
    throw new Error(`ElevenLabs TTS failed: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    audio_base64: string;
    alignment: Alignment;
  };

  const audioBuffer = Buffer.from(data.audio_base64, "base64");

  return {
    audioBuffer,
    alignment: data.alignment,
  };
}

/** Gets available quota information from ElevenLabs. */
export async function getQuotaInfo(): Promise<{
  characterCount: number;
  characterLimit: number;
  remainingCharacters: number;
}> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }

  const response = await fetch(
    "https://api.elevenlabs.io/v1/user/subscription",
    {
      headers: {
        "xi-api-key": apiKey,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ElevenLabs subscription check failed: ${response.status} - ${errorText}`,
    );
  }

  const subscription = (await response.json()) as {
    character_count: number;
    character_limit: number;
  };

  return {
    characterCount: subscription.character_count,
    characterLimit: subscription.character_limit,
    remainingCharacters:
      subscription.character_limit - subscription.character_count,
  };
}
