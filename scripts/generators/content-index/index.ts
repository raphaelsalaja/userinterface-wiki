import fs from "node:fs";
import path from "node:path";
import { type GeneratedFile, Generator } from "../../lib/generator-base";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_DIR = path.join(process.cwd(), "src", "lib", "generated");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "content-index.json");

export interface ContentIndexEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Markdown body with imports and JSX blocks stripped. */
  markdown: string;
  /** Plain text for search/grounding. */
  text: string;
}

function parseFrontmatter(raw: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: {}, body: raw };

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    frontmatter[key] = value;
  }

  return { frontmatter, body: raw.slice(match[0].length) };
}

/**
 * Strips MDX-specific syntax (imports, exports, JSX blocks) so the result
 * reads as plain markdown.
 */
function toMarkdown(body: string): string {
  return (
    body
      // Imports (single- and multi-line) and side-effect imports
      .replace(/^import\s[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "")
      .replace(/^import\s+["'][^"']+["'];?\s*$/gm, "")
      .replace(/^export\s.*$/gm, "")
      // Paired JSX blocks starting at line start (<Figure>...</Figure>)
      .replace(/^<([A-Z][a-zA-Z.]*)(\s[^>]*)?>[\s\S]*?^<\/\1>\s*$/gm, "")
      // Self-closing JSX components, possibly spanning multiple lines
      .replace(/^<[A-Z][a-zA-Z.]*(\s[^<]*?)?\/>\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\[\^[^\]]+\]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export class ContentIndexGenerator extends Generator {
  constructor() {
    super({ name: "content-index", label: "content index" });
  }

  protected async generate(): Promise<GeneratedFile[]> {
    const entries: ContentIndexEntry[] = [];

    const articles = fs
      .readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const article of articles) {
      const mdxPath = path.join(CONTENT_DIR, article.name, "index.mdx");
      if (!fs.existsSync(mdxPath)) continue;

      const raw = fs.readFileSync(mdxPath, "utf-8");
      const { frontmatter, body } = parseFrontmatter(raw);
      const markdown = toMarkdown(body);

      entries.push({
        slug: article.name,
        title: frontmatter.title ?? article.name,
        description: frontmatter.description ?? "",
        date: frontmatter.date ?? "",
        markdown,
        text: toPlainText(markdown),
      });
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2), "utf-8");

    const stats = fs.statSync(OUTPUT_PATH);

    return [
      {
        name: `content-index.json (${entries.length} articles)`,
        path: OUTPUT_PATH,
        size: stats.size,
      },
    ];
  }
}
