#!/usr/bin/env tsx

/**
 * Pre-generates TTS audio for all documents during build.
 * Uses ElevenLabs with a single voice for cost efficiency.
 *
 * Usage:
 *   pnpm generate:tts           # Generate with confirmation
 *   pnpm generate:tts --dry-run # Preview only, no API calls
 *   pnpm generate:tts --force   # Skip confirmation prompt
 *
 * Cost optimization:
 * - Single voice: no multi-voice generation
 * - Flash v2.5 model: 50% cheaper
 * - Pre-generation only: no runtime costs
 * - Paragraph-level caching: only regenerate changed paragraphs
 */

import { readdir } from "node:fs/promises";
import * as readline from "node:readline";
import { config } from "dotenv";
import pc from "picocolors";

config({ path: ".env.local", quiet: true });

import path from "node:path";
import {
  analyzeParagraphs,
  buildParagraphCacheKey,
  getPlainArticleText,
  getQuotaInfo,
  isParagraphCached,
  type ParagraphInfo,
  synthesizeSpeech,
  writeParagraphToCache,
} from "../lib/speech";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ElevenLabs pricing (as of 2024)
const COST_PER_1K_CHARS = 0.15; // Flash v2.5 model pricing

interface ParagraphStatus extends ParagraphInfo {
  isCached: boolean;
}

interface DocumentInfo {
  slugSegments: string[];
  slug: string;
  paragraphs: ParagraphStatus[];
  totalCharacters: number;
  cachedCharacters: number;
  pendingCharacters: number;
}

interface GenerationResult {
  slug: string;
  status: "cached" | "generated" | "partial" | "error";
  paragraphsGenerated: number;
  paragraphsCached: number;
  charactersGenerated: number;
  duration?: number;
  error?: unknown;
}

interface CLIOptions {
  dryRun: boolean;
  force: boolean;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run") || args.includes("-n"),
    force: args.includes("--force") || args.includes("-f"),
  };
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatChars(chars: number): string {
  if (chars >= 1000) return `${(chars / 1000).toFixed(1)}k`;
  return chars.toString();
}

function formatCost(chars: number): string {
  const cost = (chars / 1000) * COST_PER_1K_CHARS;
  if (cost < 0.01) return "<$0.01";
  return `$${cost.toFixed(2)}`;
}

async function getAllDocumentSlugs(): Promise<string[][]> {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });

  const slugs: string[][] = [];

  for (const entry of entries) {
    // Handle directory-based content (content/slug-name/index.mdx)
    if (entry.isDirectory()) {
      slugs.push([entry.name]);
    }
    // Handle flat .mdx files (content/slug-name.mdx)
    else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      const slug = entry.name.replace(/\.mdx$/, "");
      slugs.push([slug]);
    }
  }

  return slugs;
}

async function analyzeDocument(slugSegments: string[]): Promise<DocumentInfo> {
  const slug = slugSegments.join("/");
  const plainText = await getPlainArticleText(slugSegments);
  const paragraphInfos = analyzeParagraphs(plainText);

  // Check cache status for each paragraph
  const paragraphs: ParagraphStatus[] = await Promise.all(
    paragraphInfos.map(async (p) => {
      const cacheKey = buildParagraphCacheKey(slugSegments, p.hash);
      const isCached = await isParagraphCached(cacheKey);
      return { ...p, isCached };
    }),
  );

  const totalCharacters = paragraphs.reduce((sum, p) => sum + p.characters, 0);
  const cachedCharacters = paragraphs
    .filter((p) => p.isCached)
    .reduce((sum, p) => sum + p.characters, 0);
  const pendingCharacters = totalCharacters - cachedCharacters;

  return {
    slugSegments,
    slug,
    paragraphs,
    totalCharacters,
    cachedCharacters,
    pendingCharacters,
  };
}

async function generateTTSForDocument(
  doc: DocumentInfo,
): Promise<GenerationResult> {
  const pendingParagraphs = doc.paragraphs.filter((p) => !p.isCached);

  if (pendingParagraphs.length === 0) {
    return {
      slug: doc.slug,
      status: "cached",
      paragraphsGenerated: 0,
      paragraphsCached: doc.paragraphs.length,
      charactersGenerated: 0,
    };
  }

  const startTime = performance.now();
  let charactersGenerated = 0;
  let paragraphsGenerated = 0;
  let hasError = false;

  for (const paragraph of pendingParagraphs) {
    try {
      process.stdout.write(
        pc.dim(
          `  ${doc.slug} [${paragraph.index + 1}/${doc.paragraphs.length}]...`,
        ),
      );

      const { audioBuffer, alignment } = await synthesizeSpeech(paragraph.text);
      const cacheKey = buildParagraphCacheKey(doc.slugSegments, paragraph.hash);
      await writeParagraphToCache(cacheKey, audioBuffer, alignment);

      charactersGenerated += paragraph.characters;
      paragraphsGenerated++;

      process.stdout.write(
        `\r  ${pc.green("✓")} ${doc.slug} [${paragraph.index + 1}/${doc.paragraphs.length}] ${pc.dim(`${formatChars(paragraph.characters)} chars`)}\n`,
      );

      // Small delay between API calls
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.log();
      console.log(
        `  ${pc.red("✗")} ${doc.slug} [${paragraph.index + 1}] failed`,
      );
      console.log(
        pc.dim(`    ${error instanceof Error ? error.message : String(error)}`),
      );
      hasError = true;
    }
  }

  const duration = performance.now() - startTime;

  return {
    slug: doc.slug,
    status: hasError
      ? "error"
      : paragraphsGenerated > 0
        ? "generated"
        : "cached",
    paragraphsGenerated,
    paragraphsCached: doc.paragraphs.length - pendingParagraphs.length,
    charactersGenerated,
    duration,
  };
}

function printAnalysis(docs: DocumentInfo[], quotaRemaining: number) {
  const totalParagraphs = docs.reduce((sum, d) => sum + d.paragraphs.length, 0);
  const cachedParagraphs = docs.reduce(
    (sum, d) => sum + d.paragraphs.filter((p) => p.isCached).length,
    0,
  );
  const pendingParagraphs = totalParagraphs - cachedParagraphs;
  const totalPendingChars = docs.reduce(
    (sum, d) => sum + d.pendingCharacters,
    0,
  );

  console.log();
  console.log(pc.bold("  Document Analysis"));
  console.log(pc.dim("  ─────────────────────────────────────────────"));

  // Show each document with paragraph breakdown
  for (const doc of docs) {
    const cached = doc.paragraphs.filter((p) => p.isCached).length;
    const pending = doc.paragraphs.length - cached;
    const status =
      pending === 0
        ? pc.dim("cached")
        : cached > 0
          ? pc.yellow("partial")
          : pc.yellow("pending");

    console.log(
      `  ${status} ${doc.slug} ${pc.dim(`(${cached}/${doc.paragraphs.length} paragraphs cached)`)}`,
    );

    if (pending > 0) {
      console.log(
        pc.dim(
          `         → ${formatChars(doc.pendingCharacters)} chars to generate`,
        ),
      );
    }
  }

  console.log(pc.dim("  ─────────────────────────────────────────────"));

  // Summary
  console.log(
    `  ${pc.dim("Paragraphs:")} ${cachedParagraphs}/${totalParagraphs} cached`,
  );
  console.log(`  ${pc.dim("To generate:")} ${pendingParagraphs} paragraphs`);

  if (pendingParagraphs > 0) {
    console.log(
      `  ${pc.dim("Characters:")} ${formatChars(totalPendingChars)} (${formatCost(totalPendingChars)})`,
    );
    console.log(
      `  ${pc.dim("Quota remaining:")} ${formatChars(quotaRemaining)}`,
    );

    if (totalPendingChars > quotaRemaining) {
      console.log();
      console.log(
        pc.red(
          `  ⚠ Not enough quota! Need ${formatChars(totalPendingChars)}, have ${formatChars(quotaRemaining)}`,
        ),
      );
    }
  }

  console.log();
}

function printSummary(
  results: GenerationResult[],
  totalTime: number,
  totalCharsGenerated: number,
) {
  const cached = results.filter((r) => r.status === "cached").length;
  const generated = results.filter((r) => r.status === "generated").length;
  const partial = results.filter((r) => r.status === "partial").length;
  const errors = results.filter((r) => r.status === "error").length;

  const totalParagraphsGenerated = results.reduce(
    (sum, r) => sum + r.paragraphsGenerated,
    0,
  );
  const totalParagraphsCached = results.reduce(
    (sum, r) => sum + r.paragraphsCached,
    0,
  );

  console.log();

  // Document status line
  const parts: string[] = [];
  if (cached > 0) parts.push(pc.dim(`${cached} docs cached`));
  if (generated > 0) parts.push(pc.green(`${generated} docs updated`));
  if (partial > 0) parts.push(pc.yellow(`${partial} docs partial`));
  if (errors > 0) parts.push(pc.red(`${errors} docs failed`));
  console.log(`  ${parts.join(pc.dim(" · "))}`);

  // Paragraph stats
  if (totalParagraphsGenerated > 0 || totalParagraphsCached > 0) {
    console.log(
      pc.dim(
        `  ${totalParagraphsGenerated} paragraphs generated, ${totalParagraphsCached} reused from cache`,
      ),
    );
  }

  if (totalCharsGenerated > 0) {
    console.log(
      pc.dim(
        `  ${formatChars(totalCharsGenerated)} characters used (${formatCost(totalCharsGenerated)})`,
      ),
    );
  }
  console.log(pc.dim(`  ${formatDuration(totalTime)}`));
  console.log();
}

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`  ${message} (y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

async function main() {
  const options = parseArgs();

  console.log();
  if (options.dryRun) {
    console.log(pc.cyan("  [DRY RUN] No API calls will be made\n"));
  }

  console.log(pc.dim("  TTS Generation with ElevenLabs"));
  console.log(pc.dim("  Model: Flash v2.5 | Voice: j9jfwdrw7BRfcR43Qohk\n"));

  // Check environment
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

  // Get quota info
  let quotaRemaining = 0;
  try {
    const quota = await getQuotaInfo();
    quotaRemaining = quota.remainingCharacters;
  } catch {
    console.log(pc.dim("  (Could not fetch quota info)"));
  }

  // Analyze all documents
  const slugs = await getAllDocumentSlugs();
  if (slugs.length === 0) {
    console.log(pc.yellow("  No documents found\n"));
    return;
  }

  console.log(pc.dim(`  Analyzing ${slugs.length} documents...\n`));

  const docs: DocumentInfo[] = [];
  for (const slugSegments of slugs) {
    try {
      const doc = await analyzeDocument(slugSegments);
      docs.push(doc);
    } catch (error) {
      console.log(
        pc.red(`  ✗ Error analyzing ${slugSegments.join("/")}: ${error}`),
      );
    }
  }

  // Print analysis
  printAnalysis(docs, quotaRemaining);

  const docsWithPending = docs.filter((d) => d.pendingCharacters > 0);
  const totalPendingChars = docs.reduce(
    (sum, d) => sum + d.pendingCharacters,
    0,
  );

  // Dry run - exit here
  if (options.dryRun) {
    console.log(pc.cyan("  [DRY RUN] Exiting without generating\n"));
    return;
  }

  // Nothing to generate
  if (docsWithPending.length === 0) {
    console.log(pc.green("  ✓ All paragraphs already cached\n"));
    return;
  }

  // Check quota
  if (totalPendingChars > quotaRemaining) {
    console.log(pc.red("  Aborting: insufficient quota\n"));
    process.exit(1);
  }

  // Confirm generation
  const pendingParagraphs = docs.reduce(
    (sum, d) => sum + d.paragraphs.filter((p) => !p.isCached).length,
    0,
  );

  if (!options.force) {
    const shouldProceed = await confirm(
      `Generate ${pendingParagraphs} paragraphs using ${formatChars(totalPendingChars)} characters (${formatCost(totalPendingChars)})?`,
    );
    if (!shouldProceed) {
      console.log(pc.yellow("\n  Cancelled\n"));
      return;
    }
    console.log();
  }

  // Generate
  const startTime = performance.now();
  const results: GenerationResult[] = [];
  let totalCharsGenerated = 0;

  for (const doc of docs) {
    const result = await generateTTSForDocument(doc);
    results.push(result);

    if (result.charactersGenerated) {
      totalCharsGenerated += result.charactersGenerated;
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
