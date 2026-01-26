import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { PrerenderManifest } from "./types.js";

const EXCLUDE_PATTERNS = [
  /^\/_/,
  /^\/api\//,
  /\.(xml|txt|json|webmanifest|ico)$/,
];

function shouldExcludeRoute(route: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(route));
}

/**
 * Discover all analyzable routes from the Next.js build output
 *
 * @param nextDir - Path to the .next directory
 * @returns Array of route paths (e.g., ["/", "/about", "/blog/post-1"])
 */
export function discoverRoutes(nextDir: string): string[] {
  const manifestPath = join(nextDir, "prerender-manifest.json");

  if (!existsSync(manifestPath)) {
    throw new Error(
      `Prerender manifest not found at ${manifestPath}. ` +
        "Make sure to run 'next build' first.",
    );
  }

  const manifestContent = readFileSync(manifestPath, "utf-8");
  const manifest: PrerenderManifest = JSON.parse(manifestContent);

  const routes = Object.keys(manifest.routes)
    .filter((route) => !shouldExcludeRoute(route))
    .sort((a, b) => {
      if (a === "/") return -1;
      if (b === "/") return 1;
      return a.localeCompare(b);
    });

  return routes;
}

/**
 * Find the .next directory by searching upward from the given path
 *
 * @param startPath - Path to start searching from
 * @returns Path to the .next directory, or null if not found
 */
export function findNextDir(startPath: string): string | null {
  let currentPath = startPath;

  for (let i = 0; i < 10; i++) {
    const nextDir = join(currentPath, ".next");
    if (existsSync(nextDir)) return nextDir;

    const parentPath = join(currentPath, "..");
    if (parentPath === currentPath) break;
    currentPath = parentPath;
  }

  return null;
}

/**
 * Validate that a .next directory is a valid Next.js build output
 *
 * @param nextDir - Path to the .next directory
 * @returns true if valid, throws otherwise
 */
export function validateNextDir(nextDir: string): boolean {
  if (!existsSync(nextDir)) {
    throw new Error(`Next.js build directory not found: ${nextDir}`);
  }

  const requiredFiles = ["prerender-manifest.json", "BUILD_ID"];

  for (const file of requiredFiles) {
    const filePath = join(nextDir, file);
    if (!existsSync(filePath)) {
      throw new Error(
        `Invalid Next.js build directory: missing ${file}. ` +
          "Make sure to run 'next build' first.",
      );
    }
  }

  return true;
}
