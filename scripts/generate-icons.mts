import fs from "node:fs";
import path from "node:path";
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
  console.log("Generating icons...\n");

  // Ensure open-graph directory exists
  if (!fs.existsSync(OPEN_GRAPH_DIR)) {
    fs.mkdirSync(OPEN_GRAPH_DIR, { recursive: true });
  }

  // Load font
  const fontData = fs.readFileSync(FONT_PATH);

  let successCount = 0;
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

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(OPEN_GRAPH_DIR, "icon.png"));
    console.log("✓ Generated: public/open-graph/icon.png (32×32)");
    successCount++;
  } catch (error) {
    console.error("✗ Failed to generate icon.png:", error);
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

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(OPEN_GRAPH_DIR, "apple-icon.png"));
    console.log("✓ Generated: public/open-graph/apple-icon.png (180×180)");
    successCount++;
  } catch (error) {
    console.error("✗ Failed to generate apple-icon.png:", error);
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

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(OPEN_GRAPH_DIR, "icon-192.png"));
    console.log("✓ Generated: public/open-graph/icon-192.png (192×192)");
    successCount++;
  } catch (error) {
    console.error("✗ Failed to generate icon-192.png:", error);
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

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(OPEN_GRAPH_DIR, "icon-512.png"));
    console.log("✓ Generated: public/open-graph/icon-512.png (512×512)");
    successCount++;
  } catch (error) {
    console.error("✗ Failed to generate icon-512.png:", error);
    errorCount++;
  }

  console.log(`\nDone! ${successCount} successful, ${errorCount} failed`);
}

generateIcons().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
