import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { normalizeWord } from "@/lib/utils/strings";
import type { WordTimestamp } from "./alignment";
import { DEFAULT_VOICE } from "./constants";

const execAsync = promisify(exec);

// Edge TTS has a limit around 2500-3000 chars per request
const MAX_CHUNK_SIZE = 2000;
const COMMAND_TIMEOUT = 60000;

export function resolveVoice(requested?: unknown) {
  if (typeof requested === "string" && requested.trim()) {
    return requested.trim();
  }
  if (process.env.EDGE_TTS_VOICE?.trim()) {
    return process.env.EDGE_TTS_VOICE.trim();
  }
  return DEFAULT_VOICE;
}

/**
 * Split text into chunks at sentence boundaries
 */
function splitTextIntoChunks(text: string, maxSize: number): string[] {
  if (text.length <= maxSize) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxSize) {
      chunks.push(remaining);
      break;
    }

    // Find the best split point (end of sentence) within maxSize
    const sentenceEndRegex = /[.!?]\s+/g;
    let lastGoodMatch = -1;

    for (const match of remaining.matchAll(sentenceEndRegex)) {
      const endPos = match.index + match[0].length;
      if (endPos <= maxSize) {
        lastGoodMatch = endPos;
      } else {
        break;
      }
    }

    let splitIndex: number;
    if (lastGoodMatch > 0) {
      splitIndex = lastGoodMatch;
    } else {
      // No sentence boundary found, try to split at a space
      const lastSpace = remaining.lastIndexOf(" ", maxSize);
      splitIndex = lastSpace > 0 ? lastSpace + 1 : maxSize;
    }

    chunks.push(remaining.slice(0, splitIndex).trim());
    remaining = remaining.slice(splitIndex).trim();
  }

  return chunks.filter((chunk) => chunk.length > 0);
}

interface SubtitleEntry {
  start: number;
  end: number;
  text: string;
}

async function synthesizeChunk(
  text: string,
  voice: string,
): Promise<{ buffer: Buffer; subtitles: SubtitleEntry[] }> {
  const id = randomUUID();
  const textPath = join(tmpdir(), `tts-input-${id}.txt`);
  const audioPath = join(tmpdir(), `tts-output-${id}.mp3`);
  const subtitlePath = join(tmpdir(), `tts-output-${id}.vtt`);

  try {
    // Write text to file to avoid shell escaping issues
    await writeFile(textPath, text, "utf-8");

    // Run edge-tts CLI
    const command = `python3 -m edge_tts --file "${textPath}" --voice "${voice}" --write-media "${audioPath}" --write-subtitles "${subtitlePath}"`;

    await execAsync(command, { timeout: COMMAND_TIMEOUT });

    const buffer = await readFile(audioPath);

    // Parse VTT subtitles
    let subtitles: SubtitleEntry[] = [];
    try {
      const vttContent = await readFile(subtitlePath, "utf-8");
      subtitles = parseVTT(vttContent);
    } catch {
      // Subtitles may not be available
    }

    return { buffer, subtitles };
  } finally {
    // Cleanup temp files
    for (const path of [textPath, audioPath, subtitlePath]) {
      try {
        await unlink(path);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

function parseVTT(vttContent: string): SubtitleEntry[] {
  const entries: SubtitleEntry[] = [];
  const lines = vttContent.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Look for timestamp lines like "00:00:00.000 --> 00:00:01.000"
    if (line.includes("-->")) {
      const [startStr, endStr] = line.split("-->").map((s) => s.trim());
      const start = parseVTTTime(startStr);
      const end = parseVTTTime(endStr);

      // Next line(s) contain the text
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i].trim());
        i++;
      }

      if (textLines.length > 0) {
        entries.push({
          start,
          end,
          text: textLines.join(" "),
        });
      }
    }
    i++;
  }

  return entries;
}

function parseVTTTime(timeStr: string): number {
  // Format: HH:MM:SS.mmm or MM:SS.mmm
  const parts = timeStr.split(":");
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    hours = Number.parseFloat(parts[0]);
    minutes = Number.parseFloat(parts[1]);
    seconds = Number.parseFloat(parts[2]);
  } else if (parts.length === 2) {
    minutes = Number.parseFloat(parts[0]);
    seconds = Number.parseFloat(parts[1]);
  }

  return hours * 3600 + minutes * 60 + seconds;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function synthesizeChunkWithRetry(
  text: string,
  voice: string,
  chunkIndex: number,
  totalChunks: number,
): Promise<{ buffer: Buffer; subtitles: SubtitleEntry[] }> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await synthesizeChunk(text, voice);
      return result;
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES;
      console.error(
        `    Chunk ${chunkIndex + 1}/${totalChunks} attempt ${attempt}/${MAX_RETRIES} failed:`,
        error instanceof Error ? error.message : String(error),
      );
      if (isLastAttempt) {
        throw error;
      }
      await sleep(RETRY_DELAY * attempt);
    }
  }
  throw new Error("Unreachable");
}

export async function synthesizeSpeech(
  text: string,
  voice: string,
): Promise<{ audioBuffer: Buffer; timestamps: WordTimestamp[] }> {
  const chunks = splitTextIntoChunks(text, MAX_CHUNK_SIZE);
  const audioBuffers: Buffer[] = [];
  const allTimestamps: WordTimestamp[] = [];
  let timeOffset = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Add delay between chunks to avoid rate limiting
    if (i > 0) {
      await sleep(500);
    }

    const { buffer, subtitles } = await synthesizeChunkWithRetry(
      chunk,
      voice,
      i,
      chunks.length,
    );
    audioBuffers.push(buffer);

    // Convert subtitles to word timestamps with offset
    for (const entry of subtitles) {
      // Split subtitle text into words
      const words = entry.text.split(/\s+/).filter(Boolean);
      const wordDuration =
        (entry.end - entry.start) / Math.max(words.length, 1);

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const normalized = normalizeWord(word);
        if (!normalized) continue;

        allTimestamps.push({
          word,
          start: entry.start + timeOffset + j * wordDuration,
          end: entry.start + timeOffset + (j + 1) * wordDuration,
          normalized,
        });
      }
    }

    // Get actual duration from last subtitle entry
    const lastSubtitle = subtitles[subtitles.length - 1];
    if (lastSubtitle) {
      timeOffset += lastSubtitle.end;
    } else {
      // Estimate time offset based on buffer size (rough approximation)
      // 24kHz mono MP3 at 96kbps ≈ 12KB/sec
      const estimatedDuration = buffer.length / 12000;
      timeOffset += estimatedDuration;
    }
  }

  const audioBuffer = Buffer.concat(audioBuffers);

  // If no subtitles were captured, create estimated timestamps
  if (allTimestamps.length === 0) {
    return {
      audioBuffer,
      timestamps: createEstimatedTimestamps(text),
    };
  }

  return { audioBuffer, timestamps: allTimestamps };
}

function createEstimatedTimestamps(text: string): WordTimestamp[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // Estimate ~150 words per minute for natural speech
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
