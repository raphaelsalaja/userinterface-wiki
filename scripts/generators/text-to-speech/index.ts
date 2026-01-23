import { readdir } from "node:fs/promises";
import path from "node:path";
import * as readline from "node:readline";
import { log } from "@clack/prompts";
import { config } from "dotenv";
import pc from "picocolors";
import {
  analyzeParagraphs,
  buildParagraphCacheKey,
  getPlainArticleText,
  getQuotaInfo,
  isParagraphCached,
  type ParagraphInfo,
  synthesizeSpeech,
  writeParagraphToCache,
} from "../../../lib/speech";
import { type GeneratedFile, Generator } from "../../lib/generator-base";

config({ path: ".env.local", quiet: true });

const CONTENT_DIR = path.join(process.cwd(), "content");
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
  status: "generated" | "cached" | "error";
  paragraphsGenerated?: number;
  charactersGenerated?: number;
  error?: string;
}

interface TTSOptions {
  dryRun?: boolean;
  force?: boolean;
}

function formatChars(chars: number): string {
  return `${chars.toLocaleString()}`;
}

function formatCost(chars: number): string {
  const cost = (chars / 1000) * COST_PER_1K_CHARS;
  return `$${cost.toFixed(2)}`;
}

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(pc.cyan(`  ${message} (y/n) `), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

async function findContentFiles(dir: string): Promise<string[][]> {
  const files: string[][] = [];

  async function walk(currentDir: string, slugParts: string[] = []) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && entry.name !== "demos") {
        await walk(fullPath, [...slugParts, entry.name]);
      } else if (entry.name === "index.mdx") {
        files.push(slugParts);
      }
    }
  }

  await walk(dir);
  return files;
}

async function analyzeDocument(slugSegments: string[]): Promise<DocumentInfo> {
  const plainText = await getPlainArticleText(slugSegments);
  const paragraphs = analyzeParagraphs(plainText);

  const paragraphsWithStatus: ParagraphStatus[] = await Promise.all(
    paragraphs.map(async (p) => ({
      ...p,
      isCached: await isParagraphCached(
        buildParagraphCacheKey(slugSegments, p.hash),
      ),
    })),
  );

  const totalCharacters = paragraphs.reduce((sum, p) => sum + p.characters, 0);
  const cachedCharacters = paragraphsWithStatus
    .filter((p) => p.isCached)
    .reduce((sum, p) => sum + p.characters, 0);
  const pendingCharacters = totalCharacters - cachedCharacters;

  return {
    slugSegments,
    slug: slugSegments.join("/"),
    paragraphs: paragraphsWithStatus,
    totalCharacters,
    cachedCharacters,
    pendingCharacters,
  };
}

async function generateTTSForDocument(
  doc: DocumentInfo,
): Promise<GenerationResult> {
  const uncachedParagraphs = doc.paragraphs.filter((p) => !p.isCached);

  if (uncachedParagraphs.length === 0) {
    return { slug: doc.slug, status: "cached" };
  }

  try {
    let totalChars = 0;

    for (const paragraph of uncachedParagraphs) {
      const audioBuffer = await synthesizeSpeech(paragraph.text);
      const cacheKey = buildParagraphCacheKey(doc.slugSegments, paragraph.hash);
      await writeParagraphToCache(cacheKey, audioBuffer);
      totalChars += paragraph.characters;
    }

    log.success(
      `${pc.dim(doc.slug)} ${pc.gray(`(${uncachedParagraphs.length} paragraphs, ${formatChars(totalChars)} chars)`)}`,
    );

    return {
      slug: doc.slug,
      status: "generated",
      paragraphsGenerated: uncachedParagraphs.length,
      charactersGenerated: totalChars,
    };
  } catch (error) {
    log.error(
      `${pc.dim(doc.slug)} ${pc.red(error instanceof Error ? error.message : String(error))}`,
    );
    return {
      slug: doc.slug,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export class TextToSpeechGenerator extends Generator {
  private options: TTSOptions;

  constructor(options: TTSOptions = {}) {
    super({ name: "audio files", label: "text-to-speech" });
    this.options = options;
  }

  protected async generate(): Promise<GeneratedFile[]> {
    // Check API key
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error(
        "ELEVENLABS_API_KEY not found in environment. Add it to .env.local",
      );
    }

    // Get quota info
    const quota = await getQuotaInfo();
    const quotaRemaining = quota.remainingCharacters;

    log.info(
      `ElevenLabs quota: ${formatChars(quotaRemaining)} characters remaining`,
    );

    // Find and analyze all documents
    const slugs = await findContentFiles(CONTENT_DIR);
    const docs: DocumentInfo[] = [];

    for (const slug of slugs) {
      const doc = await analyzeDocument(slug);
      docs.push(doc);
    }

    // Print analysis
    const totalCharacters = docs.reduce((sum, d) => sum + d.totalCharacters, 0);
    const cachedCharacters = docs.reduce(
      (sum, d) => sum + d.cachedCharacters,
      0,
    );
    const pendingCharacters = docs.reduce(
      (sum, d) => sum + d.pendingCharacters,
      0,
    );
    const totalParagraphs = docs.reduce(
      (sum, d) => sum + d.paragraphs.length,
      0,
    );
    const cachedParagraphs = docs.reduce(
      (sum, d) => sum + d.paragraphs.filter((p) => p.isCached).length,
      0,
    );
    const pendingParagraphs = totalParagraphs - cachedParagraphs;

    log.info(
      `Total: ${totalParagraphs} paragraphs (${formatChars(totalCharacters)} chars)`,
    );
    log.info(
      `Cached: ${cachedParagraphs} paragraphs (${formatChars(cachedCharacters)} chars)`,
    );
    log.info(
      `Pending: ${pendingParagraphs} paragraphs (${formatChars(pendingCharacters)} chars, ${formatCost(pendingCharacters)})`,
    );

    const docsWithPending = docs.filter((d) => d.pendingCharacters > 0);

    // Dry run - exit early
    if (this.options.dryRun) {
      log.warning("Dry run mode - no API calls made");
      return [];
    }

    // Nothing to generate
    if (docsWithPending.length === 0) {
      log.success("All paragraphs already cached");
      return [];
    }

    // Check quota
    if (pendingCharacters > quotaRemaining) {
      throw new Error("Insufficient quota for generation");
    }

    // Confirm generation
    if (!this.options.force) {
      const shouldProceed = await confirm(
        `Generate ${pendingParagraphs} paragraphs using ${formatChars(pendingCharacters)} characters (${formatCost(pendingCharacters)})?`,
      );
      if (!shouldProceed) {
        log.warning("Generation cancelled");
        return [];
      }
    }

    // Generate
    const results: GenerationResult[] = [];
    const files: GeneratedFile[] = [];

    for (const doc of docs) {
      const result = await generateTTSForDocument(doc);
      results.push(result);

      if (result.status === "generated" && result.charactersGenerated) {
        files.push({
          name: doc.slug,
          path: "", // Not a single file
          size: result.charactersGenerated,
        });

        // Small delay between API calls
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Show remaining quota
    if (files.length > 0) {
      try {
        const newQuota = await getQuotaInfo();
        log.info(
          `Remaining quota: ${formatChars(newQuota.remainingCharacters)} characters`,
        );
      } catch {
        // Ignore
      }
    }

    const errors = results.filter((r) => r.status === "error");
    if (errors.length > 0) {
      throw new Error(`${errors.length} documents failed to generate`);
    }

    return files;
  }
}
