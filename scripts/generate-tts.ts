#!/usr/bin/env tsx

/**
 * Pre-generates TTS audio for all documents during build.
 * Uses ElevenLabs with a single voice for cost efficiency.
 *
 * Run with: pnpm generate:tts
 *
 * Cost optimization:
 * - Single voice: no multi-voice generation
 * - Flash v2.5 model: 50% cheaper
 * - Pre-generation only: no runtime costs
 */

import { readdir } from "node:fs/promises";
import { config } from "dotenv";
import pc from "picocolors";

config({ path: ".env.local", quiet: true });

import path from "node:path";
import {
  buildCacheKey,
  getPlainArticleText,
  getQuotaInfo,
  readFromCache,
  synthesizeSpeech,
  writeToCache,
} from "../lib/speech";

const CONTENT_DIR = path.join(process.cwd(), "content");

interface GenerationResult {
  slug: string;
  status: "cached" | "generated" | "error";
  characters?: number;
  duration?: number;
  error?: unknown;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatChars(chars: number): string {
  if (chars >= 1000) return `${(chars / 1000).toFixed(1)}k`;
  return chars.toString();
}

async function getAllDocumentSlugs(): Promise<string[][]> {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });

  const slugs: string[][] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      const slug = entry.name.replace(/\.mdx$/, "");
      slugs.push([slug]);
    }
  }

  return slugs;
}

async function generateTTSForDocument(
  slugSegments: string[],
): Promise<GenerationResult> {
  const slug = slugSegments.join("/");

  try {
    const plainText = await getPlainArticleText(slugSegments);
    const characters = plainText.length;
    const cacheKey = buildCacheKey(slugSegments, plainText);

    const cached = await readFromCache(cacheKey);
    if (cached) {
      return { slug, status: "cached", characters };
    }

    process.stdout.write(pc.dim(`  generating ${slug}...`));
    const startTime = performance.now();

    const synthesized = await synthesizeSpeech(plainText);
    await writeToCache(cacheKey, synthesized);

    const duration = performance.now() - startTime;

    process.stdout.write(
      `\r  ${pc.green("✓")} ${slug} ${pc.dim(`${formatChars(characters)} · ${formatDuration(duration)}`)}\n`,
    );

    return { slug, status: "generated", characters, duration };
  } catch (error) {
    console.log();
    console.log(`  ${pc.red("✗")} ${slug}`);
    console.log(
      pc.dim(`    ${error instanceof Error ? error.message : String(error)}`),
    );
    return { slug, status: "error", error };
  }
}

function printSummary(
  results: GenerationResult[],
  totalTime: number,
  totalCharsGenerated: number,
) {
  const cached = results.filter((r) => r.status === "cached").length;
  const generated = results.filter((r) => r.status === "generated").length;
  const errors = results.filter((r) => r.status === "error").length;

  console.log();

  // Status line
  const parts: string[] = [];
  if (cached > 0) parts.push(pc.dim(`${cached} cached`));
  if (generated > 0) parts.push(pc.green(`${generated} generated`));
  if (errors > 0) parts.push(pc.red(`${errors} failed`));
  console.log(`  ${parts.join(pc.dim(" · "))}`);

  if (totalCharsGenerated > 0) {
    console.log(
      pc.dim(`  ${formatChars(totalCharsGenerated)} characters used`),
    );
  }
  console.log(pc.dim(`  ${formatDuration(totalTime)}`));
  console.log();
}

async function main() {
  console.log();
  console.log(pc.dim("  Generating TTS with ElevenLabs..."));

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log(pc.yellow("  ⚠ BLOB_READ_WRITE_TOKEN not set\n"));
    return;
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    console.log(pc.yellow("  ⚠ ELEVENLABS_API_KEY not set\n"));
    return;
  }

  if (!process.env.ELEVENLABS_VOICE_ID) {
    console.log(pc.yellow("  ⚠ ELEVENLABS_VOICE_ID not set\n"));
    return;
  }

  // Show current quota
  try {
    const quota = await getQuotaInfo();
    console.log(
      pc.dim(
        `  Quota: ${formatChars(quota.remainingCharacters)} characters remaining`,
      ),
    );
  } catch {
    console.log(pc.dim("  (Could not fetch quota info)"));
  }

  const slugs = await getAllDocumentSlugs();
  console.log(pc.dim(`  ${slugs.length} documents to process\n`));

  const startTime = performance.now();
  const results: GenerationResult[] = [];
  let totalCharsGenerated = 0;

  for (const slug of slugs) {
    const result = await generateTTSForDocument(slug);
    results.push(result);

    if (result.status === "generated" && result.characters) {
      totalCharsGenerated += result.characters;
    }

    // Small delay between API calls to be nice to the API
    if (result.status === "generated") {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const totalTime = performance.now() - startTime;

  printSummary(results, totalTime, totalCharsGenerated);

  // Show remaining quota after generation
  if (totalCharsGenerated > 0) {
    try {
      const quota = await getQuotaInfo();
      console.log(
        pc.dim(
          `  Remaining quota: ${formatChars(quota.remainingCharacters)} characters\n`,
        ),
      );
    } catch {
      // Ignore
    }
  }

  const errors = results.filter((r) => r.status === "error");
  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(pc.red("  Error:"), error);
  process.exit(1);
});
