import fs from "node:fs";
import path from "node:path";
import { intro, outro, log } from "@clack/prompts";
import pc from "picocolors";
import satori from "satori";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OPEN_GRAPH_DIR = path.join(PUBLIC_DIR, "open-graph");
const FONT_PATH = path.join(PUBLIC_DIR, "fonts/inter/semi-bold.ttf");
const CONTENT_DIR = path.join(process.cwd(), "content");

interface Page {
  title: string;
  slug: string[];
}

/**
 * Extract frontmatter from MDX content
 */
function extractFrontmatter(content: string): { title: string } | null {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);

  if (!titleMatch) return null;

  return { title: titleMatch[1] };
}

/**
 * Recursively find all index.mdx files in content directory
 */
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

/**
 * Generates Open Graph images for all pages in the content source.
 * Saves them as static PNG files in public/open-graph/
 */
async function generateOGImages() {
  const startTime = performance.now();

  intro(pc.bgCyan(pc.black(" open graph ")));

  // Ensure open-graph directory exists
  if (!fs.existsSync(OPEN_GRAPH_DIR)) {
    fs.mkdirSync(OPEN_GRAPH_DIR, { recursive: true });
  }

  // Load font
  const fontData = fs.readFileSync(FONT_PATH);

  // Get all pages by scanning content directory
  const pages = findMDXFiles(CONTENT_DIR);

  const images: Array<{ name: string; path: string }> = [];
  let errorCount = 0;

  for (const page of pages) {
    try {
      const title = page.title;
      const slugPath = page.slug.join("/");
      const outputDir = path.join(OPEN_GRAPH_DIR, slugPath);
      const outputPath = path.join(outputDir, "image.png");

      // Create nested directories if needed
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate SVG using Satori
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
                      children: title,
                    },
                  },
                ],
              },
            },
          },
        },
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

      // Convert SVG to PNG using sharp
      await sharp(Buffer.from(svg)).png().toFile(outputPath);

      images.push({
        name: slugPath,
        path: outputPath,
      });
    } catch (error) {
      console.error(
        pc.red(`  ✗ Failed to generate OG image for ${page.slug.join("/")}):`),
        error,
      );
      errorCount++;
    }
  }

  // Generate default OG image
  try {
    const defaultOutputPath = path.join(OPEN_GRAPH_DIR, "default.png");

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
                fontSize: 72,
                fontWeight: 600,
                color: "#202020",
                letterSpacing: "-1.07px",
                lineHeight: 1,
              },
              children: "ui.wiki",
            },
          },
        },
      },
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

    await sharp(Buffer.from(svg)).png().toFile(defaultOutputPath);
    images.push({
      name: "default",
      path: defaultOutputPath,
    });
  } catch (error) {
    console.error(pc.red("  ✗ Failed to generate default OG image:"), error);
    errorCount++;
  }

  // Print results
  for (const image of images) {
    const stats = fs.statSync(image.path);
    const sizeKb = (stats.size / 1024).toFixed(1);
    const displayName = image.name === "default" ? "default" : image.name;
    log.success(`${pc.dim(displayName)} ${pc.gray(`(${sizeKb} kB)`)}`);
  }

  const duration = ((performance.now() - startTime) / 1000).toFixed(2);

  if (errorCount > 0) {
    outro(
      pc.yellow(
        `${images.length} images generated with ${errorCount} errors in ${duration}s`,
      ),
    );
  } else {
    outro(pc.green(`${images.length} images in ${duration}s`));
  }
}

generateOGImages().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
