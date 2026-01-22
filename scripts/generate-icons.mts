import fs from "node:fs";
import path from "node:path";
import { intro, outro, log } from "@clack/prompts";
import pc from "picocolors";
import satori from "satori";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OPEN_GRAPH_DIR = path.join(PUBLIC_DIR, "open-graph");
const FONT_PATH = path.join(PUBLIC_DIR, "fonts/inter/bold.ttf");

/**
 * Generates favicon and Apple touch icon at build time.
 * Saves them as static PNG files in public/open-graph/
 */
async function generateIcons() {
  const startTime = performance.now();

  intro(pc.bgCyan(pc.black(" icons ")));

  // Ensure open-graph directory exists
  if (!fs.existsSync(OPEN_GRAPH_DIR)) {
    fs.mkdirSync(OPEN_GRAPH_DIR, { recursive: true });
  }

  // Load font
  const fontData = fs.readFileSync(FONT_PATH);

  const icons: Array<{ name: string; size: string; path: string }> = [];
  let errorCount = 0;

  // Generate standard favicon (32×32)
  try {
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            fontSize: 24,
            background: "#111113",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fcfcfc",
            borderRadius: 6,
            fontWeight: 700,
            fontFamily: "Inter",
          },
          children: "U",
        },
      },
      {
        width: 32,
        height: 32,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );

    const iconPath = path.join(OPEN_GRAPH_DIR, "icon.png");
    await sharp(Buffer.from(svg)).png().toFile(iconPath);
    icons.push({ name: "icon.png", size: "32×32", path: iconPath });
  } catch (error) {
    console.error(pc.red("  ✗ Failed to generate icon.png:"), error);
    errorCount++;
  }

  // Generate Apple touch icon (180×180)
  try {
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            fontSize: 120,
            background: "#111113",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fcfcfc",
            borderRadius: 40,
            fontWeight: 700,
            fontFamily: "Inter",
          },
          children: "U",
        },
      },
      {
        width: 180,
        height: 180,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );

    const iconPath = path.join(OPEN_GRAPH_DIR, "apple-icon.png");
    await sharp(Buffer.from(svg)).png().toFile(iconPath);
    icons.push({ name: "apple-icon.png", size: "180×180", path: iconPath });
  } catch (error) {
    console.error(pc.red("  ✗ Failed to generate apple-icon.png:"), error);
    errorCount++;
  }

  // Generate PWA icon 192×192
  try {
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            fontSize: 128,
            background: "#111113",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fcfcfc",
            borderRadius: 42,
            fontWeight: 700,
            fontFamily: "Inter",
          },
          children: "U",
        },
      },
      {
        width: 192,
        height: 192,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );

    const iconPath = path.join(OPEN_GRAPH_DIR, "icon-192.png");
    await sharp(Buffer.from(svg)).png().toFile(iconPath);
    icons.push({ name: "icon-192.png", size: "192×192", path: iconPath });
  } catch (error) {
    console.error(pc.red("  ✗ Failed to generate icon-192.png:"), error);
    errorCount++;
  }

  // Generate PWA icon 512×512
  try {
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            fontSize: 340,
            background: "#111113",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fcfcfc",
            borderRadius: 112,
            fontWeight: 700,
            fontFamily: "Inter",
          },
          children: "U",
        },
      },
      {
        width: 512,
        height: 512,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );

    const iconPath = path.join(OPEN_GRAPH_DIR, "icon-512.png");
    await sharp(Buffer.from(svg)).png().toFile(iconPath);
    icons.push({ name: "icon-512.png", size: "512×512", path: iconPath });
  } catch (error) {
    console.error(pc.red("  ✗ Failed to generate icon-512.png:"), error);
    errorCount++;
  }

  // Print results
  for (const icon of icons) {
    const stats = fs.statSync(icon.path);
    const sizeKb = (stats.size / 1024).toFixed(1);
    log.success(
      `${pc.dim(icon.name)} ${pc.gray(`(${icon.size}, ${sizeKb} kB)`)}`,
    );
  }

  const duration = ((performance.now() - startTime) / 1000).toFixed(2);

  if (errorCount > 0) {
    outro(
      pc.yellow(
        `${icons.length} icons generated with ${errorCount} errors in ${duration}s`,
      ),
    );
  } else {
    outro(pc.green(`${icons.length} icons in ${duration}s`));
  }
}

generateIcons().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
