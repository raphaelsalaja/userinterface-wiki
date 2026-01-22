import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import satori from "satori";
import sharp from "sharp";
import { type GeneratedFile, Generator } from "../../lib/generator-base";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OPEN_GRAPH_DIR = path.join(PUBLIC_DIR, "open-graph");
const FONT_PATH = path.join(PUBLIC_DIR, "fonts/inter/bold.ttf");

interface IconConfig {
  name: string;
  size: number;
  fontSize: number;
  borderRadius: number;
  displaySize: string;
}

const ICONS: IconConfig[] = [
  {
    name: "icon.png",
    size: 32,
    fontSize: 24,
    borderRadius: 6,
    displaySize: "32×32",
  },
  {
    name: "apple-icon.png",
    size: 180,
    fontSize: 120,
    borderRadius: 40,
    displaySize: "180×180",
  },
  {
    name: "icon-192.png",
    size: 192,
    fontSize: 128,
    borderRadius: 42,
    displaySize: "192×192",
  },
  {
    name: "icon-512.png",
    size: 512,
    fontSize: 340,
    borderRadius: 112,
    displaySize: "512×512",
  },
];

export class IconsGenerator extends Generator {
  constructor() {
    super({ name: "icons", label: "icons" });
  }

  protected async generate(): Promise<GeneratedFile[]> {
    // Ensure directory exists
    if (!fs.existsSync(OPEN_GRAPH_DIR)) {
      fs.mkdirSync(OPEN_GRAPH_DIR, { recursive: true });
    }

    // Load font
    const fontData = fs.readFileSync(FONT_PATH);

    const files: GeneratedFile[] = [];

    for (const icon of ICONS) {
      const svg = await satori(
        {
          type: "div",
          props: {
            style: {
              fontSize: icon.fontSize,
              background: "#111113",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fcfcfc",
              borderRadius: icon.borderRadius,
              fontWeight: 700,
              fontFamily: "Inter",
            },
            children: "U",
          },
        } as ReactNode,
        {
          width: icon.size,
          height: icon.size,
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

      const iconPath = path.join(OPEN_GRAPH_DIR, icon.name);
      await sharp(Buffer.from(svg)).png().toFile(iconPath);

      const stats = fs.statSync(iconPath);
      files.push({
        name: `${icon.name} (${icon.displaySize})`,
        path: iconPath,
        size: stats.size,
      });
    }

    return files;
  }
}
