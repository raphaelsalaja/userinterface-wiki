import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface DemoInfo {
  article: string;
  slug: string;
  path: string;
  url: string;
  key: string;
}

export function getAllDemos(): DemoInfo[] {
  const demos: DemoInfo[] = [];

  const articles = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  for (const article of articles) {
    if (!article.isDirectory()) continue;

    const demosDir = path.join(CONTENT_DIR, article.name, "demos");

    if (!fs.existsSync(demosDir)) continue;

    const demoFolders = fs.readdirSync(demosDir, { withFileTypes: true });

    for (const demoFolder of demoFolders) {
      if (!demoFolder.isDirectory()) continue;

      const demoIndexPath = path.join(demosDir, demoFolder.name, "index.tsx");
      if (!fs.existsSync(demoIndexPath)) continue;

      demos.push({
        article: article.name,
        slug: demoFolder.name,
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
  const withoutNumber = slug.replace(/^\d+-/, "");
  return withoutNumber
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
