import { fetchAndParseOGMetadata } from "./parser.js";
import { discoverRoutes, validateNextDir } from "./routes.js";
import type { AnalysisReport, ImageInfo, RouteAnalysis } from "./types.js";
import {
  fetchImageInfo,
  getValidationSummary,
  validateMetadata,
} from "./validator.js";

export interface AnalyzeOptions {
  nextDir: string;
  baseUrl: string;
  onProgress?: (current: number, total: number, route: string) => void;
  validateImages?: boolean;
}

async function analyzeRoute(
  route: string,
  baseUrl: string,
  validateImages: boolean,
): Promise<RouteAnalysis> {
  const url = new URL(route, baseUrl).toString();

  try {
    const metadata = await fetchAndParseOGMetadata(url);

    let imageInfo: ImageInfo | undefined;
    if (validateImages && metadata.og.image) {
      imageInfo = await fetchImageInfo(metadata.og.image);
      if (metadata.og.imageWidth && metadata.og.imageHeight) {
        imageInfo.width = Number.parseInt(metadata.og.imageWidth, 10);
        imageInfo.height = Number.parseInt(metadata.og.imageHeight, 10);
      }
    }

    return {
      route,
      url,
      metadata,
      issues: validateMetadata(metadata, imageInfo),
      imageInfo,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      route,
      url,
      metadata: { og: {}, twitter: {}, basic: {} },
      issues: [
        {
          tag: "fetch",
          message: error instanceof Error ? error.message : "Unknown error",
          severity: "error",
        },
      ],
      fetchedAt: new Date().toISOString(),
    };
  }
}

export async function analyze(
  options: AnalyzeOptions,
): Promise<AnalysisReport> {
  const { nextDir, baseUrl, onProgress, validateImages = true } = options;

  validateNextDir(nextDir);
  const routes = discoverRoutes(nextDir);

  if (routes.length === 0) {
    throw new Error("No routes found to analyze");
  }

  const results: RouteAnalysis[] = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    onProgress?.(i + 1, routes.length, route);
    results.push(await analyzeRoute(route, baseUrl, validateImages));
  }

  const summary = {
    total: results.length,
    valid: 0,
    withErrors: 0,
    withWarnings: 0,
  };
  for (const result of results) {
    const { errors, warnings, isValid } = getValidationSummary(result.issues);
    if (isValid) summary.valid++;
    if (errors > 0) summary.withErrors++;
    if (warnings > 0) summary.withWarnings++;
  }

  return {
    baseUrl,
    analyzedAt: new Date().toISOString(),
    routes: results,
    summary,
  };
}

export async function waitForServer(
  url: string,
  timeout = 30000,
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok || response.status === 404) return true;
    } catch {
      // Server not ready
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

export async function findNextServer(): Promise<string | null> {
  // Check PORT env var first
  const envPort = process.env.PORT;
  if (envPort) {
    const url = `http://localhost:${envPort}`;
    if (await isNextServer(url)) return url;
  }

  // Scan common Next.js ports
  const ports = [3000, 3001, 3002, 3003, 3004, 3005];
  for (const port of ports) {
    const url = `http://localhost:${port}`;
    if (await isNextServer(url)) return url;
  }

  return null;
}

async function isNextServer(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const poweredBy = response.headers.get("x-powered-by");
    return poweredBy?.includes("Next.js") ?? false;
  } catch {
    return false;
  }
}
