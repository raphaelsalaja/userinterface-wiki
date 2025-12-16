#!/usr/bin/env tsx

/**
 * Pre-generates TTS audio for all documents during build.
 * Run with: pnpm generate:tts
 */

import { readdir } from "node:fs/promises";
import { config } from "dotenv";
import pc from "picocolors";

config({ path: ".env.local", quiet: true });

import { getPlainArticleText } from "../lib/features/tts/article";
import {
  buildCacheKey,
  readFromCache,
  writeToCache,
} from "../lib/features/tts/cache";
import { CONTENT_DIR } from "../lib/features/tts/constants";
import {
  resolveModelId,
  resolveVoiceId,
  synthesizeSpeech,
} from "../lib/features/tts/elevenlabs";

interface ElevenLabsSubscription {
  tier: string;
  character_count: number;
  character_limit: number;
  can_extend_character_limit: boolean;
  allowed_to_extend_character_limit: boolean;
  next_character_count_reset_unix: number;
  voice_limit: number;
  max_voice_add_edits: number;
  voice_add_edit_counter: number;
  professional_voice_limit: number;
  can_extend_voice_limit: boolean;
  can_use_instant_voice_cloning: boolean;
  can_use_professional_voice_cloning: boolean;
  currency: string;
  status: string;
  billing_period: string;
  character_refresh_period: string;
  next_invoice?: {
    amount_due_cents: number;
    next_payment_attempt_unix: number;
  };
}

interface ElevenLabsUser {
  subscription: ElevenLabsSubscription;
  xi_api_key: string;
  is_new_user: boolean;
  first_name?: string;
}

async function getElevenLabsUsage(): Promise<ElevenLabsUser | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey },
    });

    if (!response.ok) return null;
    return (await response.json()) as ElevenLabsUser;
  } catch {
    return null;
  }
}

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
  const voiceId = resolveVoiceId();
  const modelId = resolveModelId();

  try {
    const plainText = await getPlainArticleText(slugSegments);
    const characters = plainText.length;
    const cacheKey = buildCacheKey(slugSegments, plainText, voiceId, modelId);

    const cached = await readFromCache(cacheKey);
    if (cached) {
      return { slug, status: "cached", characters };
    }

    process.stdout.write(pc.dim(`  generating ${slug}...`));
    const startTime = performance.now();

    const synthesized = await synthesizeSpeech(plainText, voiceId, modelId);
    await writeToCache(cacheKey, synthesized);

    const duration = performance.now() - startTime;

    process.stdout.write(
      `\r  ${pc.green("✓")} ${slug} ${pc.dim(`${formatChars(characters)} · ${formatDuration(duration)}`)}\n`,
    );

    return { slug, status: "generated", characters, duration };
  } catch (error) {
    process.stdout.write(`\r  ${pc.red("✗")} ${slug}\n`);
    return { slug, status: "error", error };
  }
}

function printSummary(
  results: GenerationResult[],
  totalTime: number,
  usageBefore: ElevenLabsUser | null,
  usageAfter: ElevenLabsUser | null,
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

  // Usage diff from API
  if (usageAfter?.subscription) {
    const sub = usageAfter.subscription;
    const charsBefore =
      usageBefore?.subscription?.character_count ?? sub.character_count;
    const charsUsed = sub.character_count - charsBefore;
    const remaining = sub.character_limit - sub.character_count;
    const pct = ((sub.character_count / sub.character_limit) * 100).toFixed(0);

    const usedStr =
      charsUsed > 0 ? pc.yellow(`+${formatChars(charsUsed)}`) : "";
    const remainingColor = remaining < 10000 ? pc.red : pc.dim;

    console.log(
      `  ${usedStr}${usedStr ? " " : ""}${pc.dim(`${formatChars(sub.character_count)}/${formatChars(sub.character_limit)}`)} ${remainingColor(`${formatChars(remaining)} left`)} ${pc.dim(`(${pct}%)`)}`,
    );
  }

  console.log(pc.dim(`  ${formatDuration(totalTime)}`));
  console.log();
}

async function main() {
  console.log();
  console.log(pc.dim("  Generating TTS..."));

  if (!process.env.ELEVENLABS_API_KEY) {
    console.log(pc.yellow("  ⚠ ELEVENLABS_API_KEY not set\n"));
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log(pc.yellow("  ⚠ BLOB_READ_WRITE_TOKEN not set\n"));
    return;
  }

  const usageBefore = await getElevenLabsUsage();
  const slugs = await getAllDocumentSlugs();
  const startTime = performance.now();
  const results: GenerationResult[] = [];

  for (const slug of slugs) {
    const result = await generateTTSForDocument(slug);
    results.push(result);
  }

  const totalTime = performance.now() - startTime;
  const usageAfter = await getElevenLabsUsage();

  printSummary(results, totalTime, usageBefore, usageAfter);

  const errors = results.filter((r) => r.status === "error");
  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(pc.red("  Error:"), error);
  process.exit(1);
});
