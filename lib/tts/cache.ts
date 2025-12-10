import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import type { PutBlobResult } from "@vercel/blob";
import { head, put } from "@vercel/blob";
import type { WordTimestamp } from "./alignment";
import { CACHE_PREFIX } from "./constants";
import { isNotFound } from "./errors";

export interface CacheKey {
  base: string;
  hash: string;
}

export function buildCacheKey(
  slugSegments: string[],
  text: string,
  voiceId: string,
  modelId: string,
): CacheKey {
  const contentHash = hashContent(`${text}::${voiceId}::${modelId}`);
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
