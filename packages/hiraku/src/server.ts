import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AnalysisReport } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_DIR = join(__dirname, "..", "dist", "ui");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export function startServer(
  report: AnalysisReport,
  port: number,
): Promise<void> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url || "/";

      // API endpoint for report data
      if (url === "/api/report") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(report));
        return;
      }

      // Serve static files from UI build
      let filePath = join(UI_DIR, url === "/" ? "index.html" : url);

      // Handle SPA routing - serve index.html for non-file requests
      if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
        filePath = join(UI_DIR, "index.html");
      }

      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const ext = extname(filePath);
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => {
      resolve();
    });
  });
}
