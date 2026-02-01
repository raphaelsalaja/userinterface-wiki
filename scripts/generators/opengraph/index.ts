import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import satori from "satori";
import sharp from "sharp";
import { type GeneratedFile, Generator } from "../../lib/generator-base";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OPEN_GRAPH_DIR = path.join(PUBLIC_DIR, "open-graph");
const FONT_PATH = path.join(PUBLIC_DIR, "fonts/inter/semi-bold.ttf");
const CONTENT_DIR = path.join(process.cwd(), "content");

interface Page {
  title: string;
  slug: string[];
}

function extractFrontmatter(content: string): { title: string } | null {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);

  if (!titleMatch) return null;

  return { title: titleMatch[1] };
}

function findMDXFiles(dir: string): Page[] {
  const pages: Page[] = [];

  function walk(currentDir: string, slugParts: string[] = []) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && entry.name !== "demos") {
        walk(fullPath, [...slugParts, entry.name]);
      } else if (entry.name === "index.mdx") {
        const content = fs.readFileSync(fullPath, "utf-8");
        const frontmatter = extractFrontmatter(content);

        if (frontmatter) {
          pages.push({
            title: frontmatter.title,
            slug: slugParts,
          });
        }
      }
    }
  }

  walk(dir);
  return pages;
}

export class OpenGraphGenerator extends Generator {
  constructor() {
    super({ name: "images", label: "open graph" });
  }

  protected async generate(): Promise<GeneratedFile[]> {
    if (!fs.existsSync(OPEN_GRAPH_DIR)) {
      fs.mkdirSync(OPEN_GRAPH_DIR, { recursive: true });
    }

    const fontData = fs.readFileSync(FONT_PATH);
    const pages = findMDXFiles(CONTENT_DIR);
    const files: GeneratedFile[] = [];

    for (const page of pages) {
      const slugPath = page.slug.join("/");
      const outputDir = path.join(OPEN_GRAPH_DIR, slugPath);
      const outputPath = path.join(outputDir, "image.png");

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const svg = await satori(
        {
          type: "div",
          props: {
            style: {
              background: "#fcfcfc",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 64,
              fontFamily: "Inter",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 48,
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 48,
                        fontWeight: 600,
                        color: "#202020",
                        letterSpacing: "-1.07px",
                        lineHeight: 1,
                      },
                      children: "ui.wiki",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        width: 2,
                        height: 32,
                        background: "#bbb",
                      },
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 48,
                        fontWeight: 600,
                        color: "#202020",
                        letterSpacing: "-1.07px",
                        lineHeight: 1,
                      },
                      children: page.title,
                    },
                  },
                ],
              },
            },
          },
        } as ReactNode,
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: "Inter",
              data: fontData,
              style: "normal",
              weight: 600,
            },
          ],
        },
      );

      await sharp(Buffer.from(svg)).png().toFile(outputPath);

      const stats = fs.statSync(outputPath);
      files.push({
        name: slugPath,
        path: outputPath,
        size: stats.size,
      });
    }

    return files;
  }
}
