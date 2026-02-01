import fs from "node:fs";
import path from "node:path";
import {
  DIM,
  type GeneratedFile,
  Generator,
  RESET,
} from "../../lib/generator-base";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_PATH = path.join(process.cwd(), "lib", "demo-registry.ts");

interface DemoEntry {
  key: string;
  article: string;
  demo: string;
  exportName: string;
  importPath: string;
}

interface ScanResult {
  entries: DemoEntry[];
  warnings: string[];
}

function extractExportName(filePath: string): string | null {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/export function (\w+)\s*\(/);
  return match ? match[1] : null;
}

function scanDemos(): ScanResult {
  const entries: DemoEntry[] = [];
  const warnings: string[] = [];

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

      const exportName = extractExportName(demoIndexPath);
      if (!exportName) {
        warnings.push(`${article.name}/demos/${demoFolder.name}`);
        continue;
      }

      entries.push({
        key: `${article.name}/${demoFolder.name}`,
        article: article.name,
        demo: demoFolder.name,
        exportName,
        importPath: `@/content/${article.name}/demos/${demoFolder.name}`,
      });
    }
  }

  return {
    entries: entries.sort((a, b) => a.key.localeCompare(b.key)),
    warnings,
  };
}

function generateRegistryContent(entries: DemoEntry[]): string {
  const imports = entries
    .map(
      (e) =>
        `  "${e.key}": dynamic(() =>\n    import("${e.importPath}").then((m) => m.${e.exportName}),\n  ),`,
    )
    .join("\n");

  return `// Auto-generated. Run \`pnpm generate demos\` to regenerate.

import type { ComponentType } from "react";
import dynamic from "next/dynamic";

export const demoRegistry: Record<string, ComponentType> = {
${imports}
};

export function getDemo(key: string): ComponentType | undefined {
  return demoRegistry[key];
}

export function hasDemo(key: string): boolean {
  return key in demoRegistry;
}

export function getDemoKeys(): string[] {
  return Object.keys(demoRegistry);
}
`;
}

export class DemosGenerator extends Generator {
  constructor() {
    super({ name: "demos", label: "demo registry" });
  }

  protected async generate(): Promise<GeneratedFile[]> {
    const { entries, warnings } = scanDemos();

    if (warnings.length > 0) {
      this.warn(`${warnings.length} demo(s) missing export function`);
      for (const w of warnings) {
        console.log(`  ${DIM}→${RESET} ${w}`);
      }
    }

    const content = generateRegistryContent(entries);
    fs.writeFileSync(OUTPUT_PATH, content, "utf-8");

    const stats = fs.statSync(OUTPUT_PATH);

    return [
      {
        name: `demo-registry.ts ${DIM}(${entries.length} demos)${RESET}`,
        path: OUTPUT_PATH,
        size: stats.size,
      },
    ];
  }
}
