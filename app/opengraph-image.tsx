import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "ui.wiki - A Living Manual for Better Interfaces.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  const imageBuffer = readFileSync(
    join(process.cwd(), "public/og/default.png"),
  );

  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
