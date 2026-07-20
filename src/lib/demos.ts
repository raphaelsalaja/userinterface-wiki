import fs from "node:fs";
import path from "node:path";
import { source } from "./source";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface DemoInfo {
  article: string;
  articleTitle: string;
  slug: string;
  title: string;
  path: string;
  url: string;
  key: string;
}

/**
 * Reads the demos barrel (demos/index.ts) and returns folder names in export
 * order. Demo directories use plain descriptive names, so the barrel — which
 * mirrors the article's narrative order — is the source of sequence.
 */
function getBarrelOrder(demosDir: string): string[] {
  const barrelPath = path.join(demosDir, "index.ts");
  if (!fs.existsSync(barrelPath)) return [];

  const content = fs.readFileSync(barrelPath, "utf-8");
  return [...content.matchAll(/from\s+"\.\/([^"]+)"/g)].map(
    (match) => match[1],
  );
}

export function getAllDemos(): DemoInfo[] {
  const demos: DemoInfo[] = [];

  const articles = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  for (const article of articles) {
    if (!article.isDirectory()) continue;

    const demosDir = path.join(CONTENT_DIR, article.name, "demos");

    if (!fs.existsSync(demosDir)) continue;

    const page = source.getPage([article.name]);
    const articleTitle = page?.data.title ?? formatDemoTitle(article.name);

    const barrelOrder = getBarrelOrder(demosDir);
    const demoFolders = fs
      .readdirSync(demosDir, { withFileTypes: true })
      .sort((a, b) => {
        const indexA = barrelOrder.indexOf(a.name);
        const indexB = barrelOrder.indexOf(b.name);
        if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

    for (const demoFolder of demoFolders) {
      if (!demoFolder.isDirectory()) continue;

      const demoIndexPath = path.join(demosDir, demoFolder.name, "index.tsx");
      if (!fs.existsSync(demoIndexPath)) continue;

      demos.push({
        article: article.name,
        articleTitle,
        slug: demoFolder.name,
        title: formatDemoTitle(demoFolder.name),
        path: path.join(demosDir, demoFolder.name),
        url: `/demo/${demoFolder.name}`,
        key: `${article.name}/${demoFolder.name}`,
      });
    }
  }

  return demos;
}

export function getDemo(slug: string): DemoInfo | undefined {
  const demos = getAllDemos();
  return demos.find((d) => d.slug === slug);
}

export function getAdjacentDemos(slug: string): {
  prev: DemoInfo | null;
  next: DemoInfo | null;
  current: number;
  total: number;
} {
  const demos = getAllDemos();
  const currentIndex = demos.findIndex((d) => d.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null, current: 0, total: demos.length };
  }

  return {
    prev: currentIndex > 0 ? demos[currentIndex - 1] : null,
    next: currentIndex < demos.length - 1 ? demos[currentIndex + 1] : null,
    current: currentIndex + 1,
    total: demos.length,
  };
}

export function generateDemoParams(): { slug: string }[] {
  return getAllDemos().map((demo) => ({
    slug: demo.slug,
  }));
}

export function formatDemoTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
