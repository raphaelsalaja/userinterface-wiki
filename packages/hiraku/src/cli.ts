import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { resolve } from "node:path";
import boxen from "boxen";
import mri from "mri";
import pc from "picocolors";
import { analyze, findNextServer, waitForServer } from "./analyzer.js";
import { findNextDir } from "./routes.js";
import { startServer } from "./server.js";

const VERSION = "0.1.0";

const args = mri(process.argv.slice(2), {
  default: { port: 6767, dir: process.cwd(), watch: false, open: true },
  alias: { p: "port", d: "dir", u: "url", w: "watch", h: "help", o: "open" },
  boolean: ["watch", "help", "open"],
});

if (args.help) {
  console.log(`
  ${pc.bold("hiraku")} - OpenGraph metadata analyzer for Next.js

  ${pc.dim("Usage")}
    $ hiraku [options]

  ${pc.dim("Options")}
    -p, --port    UI port ${pc.dim("(default: 6767)")}
    -d, --dir     Project directory
    -u, --url     Server URL to analyze
    -w, --watch   Watch for changes
    -h, --help    Show help
`);
  process.exit(0);
}

async function main() {
  const startTime = Date.now();

  console.log(
    `${pc.green("●")}  ${pc.bold("hiraku")} ${pc.dim(`v${VERSION}`)}`,
  );

  const projectDir = resolve(args.dir);
  const nextDir = findNextDir(projectDir);

  if (!nextDir) {
    console.log(`${pc.red("●")}  Could not find .next directory`);
    console.log(
      `${pc.dim("│")}  Run ${pc.cyan("next build")} first or specify ${pc.cyan("--url")}`,
    );
    process.exit(1);
  }

  let serverUrl = args.url;
  let killServer: (() => void) | undefined;

  if (!serverUrl) {
    console.log(`${pc.dim("│")}`);
    console.log(`${pc.yellow("●")}  Looking for server...`);

    const existing = await findNextServer();
    if (existing) {
      serverUrl = existing;
      console.log(`   ${pc.dim("Found at")} ${pc.underline(serverUrl)}`);
    } else {
      const port = 3456;
      serverUrl = `http://localhost:${port}`;
      console.log(`   ${pc.dim("Starting server on port")} ${port}...`);

      const bin = existsSync(`${projectDir}/node_modules/.bin/next`)
        ? `${projectDir}/node_modules/.bin/next`
        : "npx next";

      const proc = spawn(bin, ["start", "-p", String(port)], {
        cwd: projectDir,
        stdio: "pipe",
        shell: true,
      });
      killServer = () => proc.kill();

      try {
        await waitForServer(serverUrl);
      } catch {
        console.log(`${pc.red("●")}  Failed to start server`);
        killServer();
        process.exit(1);
      }
    }
  } else {
    console.log(`${pc.dim("│")}`);
    console.log(`${pc.yellow("●")}  Using ${pc.underline(serverUrl)}`);
  }

  console.log(`${pc.dim("│")}`);
  console.log(`${pc.yellow("●")}  Analyzing...`);

  const report = await analyze({
    nextDir,
    baseUrl: serverUrl,
  });

  killServer?.();

  const duration = Date.now() - startTime;

  console.log(`${pc.dim("│")}`);
  const box = boxen(
    `${pc.bold("hiraku ready!")}\n\n${pc.dim("- Local:")}        ${pc.cyan(pc.underline(`http://localhost:${args.port}/`))}`,
    {
      padding: 1,
      borderColor: "magenta",
      borderStyle: "round",
    },
  );
  // Add vertical line beside the box
  const boxLines = box.split("\n");
  for (const line of boxLines) {
    console.log(`${pc.dim("│")}   ${line}`);
  }
  console.log(`${pc.dim("│")}`);
  console.log(`${pc.green("●")}  ${pc.dim(`${duration} ms`)}`);
  console.log();

  await startServer(report, args.port);

  if (args.open) {
    const open = await import("open").then((m) => m.default).catch(() => null);
    if (open) await open(`http://localhost:${args.port}`);
  }

  if (args.watch) {
    console.log(`${pc.yellow("●")}  Watching for changes...`);
    watch(resolve(nextDir, "prerender-manifest.json"), async () => {
      console.log(`${pc.yellow("●")}  Re-analyzing...`);
      const r = await analyze({ nextDir, baseUrl: serverUrl as string });
      console.log(`${pc.green("●")}  Analyzed ${r.summary.total} routes`);
    });
  }
}

main().catch((e) => {
  console.log(`${pc.red("●")}  ${e.message}`);
  process.exit(1);
});
