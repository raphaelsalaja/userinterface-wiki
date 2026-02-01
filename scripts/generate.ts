import pc from "picocolors";
import { DemosGenerator } from "./generators/demos";
import { IconsGenerator } from "./generators/icons";
import { OpenGraphGenerator } from "./generators/opengraph";
import { PlaygroundsGenerator } from "./generators/playgrounds";
import { TextToSpeechGenerator } from "./generators/text-to-speech";

// 256-color grays for cross-theme compatibility
const RESET = "\x1b[0m";
const DIM = "\x1b[38;5;102m";
const TEXT = "\x1b[38;5;145m";

// Gradient grays for the logo
const GRAYS = [
  "\x1b[38;5;250m",
  "\x1b[38;5;248m",
  "\x1b[38;5;245m",
  "\x1b[38;5;243m",
  "\x1b[38;5;240m",
];

const LOGO = [
  "██╗   ██╗██╗  ██╗    ██╗██╗██╗  ██╗██╗",
  "██║   ██║██║  ██║    ██║██║██║ ██╔╝██║",
  "██║   ██║██║  ██║ █╗ ██║██║█████╔╝ ██║",
  "██║   ██║██║  ██║███╗██║██║██╔═██╗ ██║",
  "╚██████╔╝██║  ╚███╔███╔╝██║██║  ██╗██║",
  " ╚═════╝ ╚═╝   ╚══╝╚══╝ ╚═╝╚═╝  ╚═╝╚═╝",
];

function showLogo(): void {
  console.log();
  for (let i = 0; i < LOGO.length; i++) {
    const gray = GRAYS[Math.min(i, GRAYS.length - 1)];
    console.log(`${gray}${LOGO[i]}${RESET}`);
  }
}

function showBanner(): void {
  showLogo();
  console.log();
  console.log(`${DIM}Asset generator for ui.wiki${RESET}`);
  console.log();
  console.log(
    `  ${DIM}$${RESET} ${TEXT}pnpm generate${RESET}              ${DIM}Run all generators${RESET}`,
  );
  console.log(
    `  ${DIM}$${RESET} ${TEXT}pnpm generate demos${RESET}        ${DIM}Generate demo registry${RESET}`,
  );
  console.log(
    `  ${DIM}$${RESET} ${TEXT}pnpm generate icons${RESET}        ${DIM}Generate app icons${RESET}`,
  );
  console.log(
    `  ${DIM}$${RESET} ${TEXT}pnpm generate opengraph${RESET}    ${DIM}Generate OG images${RESET}`,
  );
  console.log(
    `  ${DIM}$${RESET} ${TEXT}pnpm generate playgrounds${RESET}  ${DIM}Generate playground files${RESET}`,
  );
  console.log(
    `  ${DIM}$${RESET} ${TEXT}pnpm generate tts${RESET}          ${DIM}Generate speech audio${RESET}`,
  );
  console.log();
  console.log(`${DIM}Options:${RESET}`);
  console.log(
    `  ${TEXT}--watch${RESET}     ${DIM}Watch for changes (playgrounds only)${RESET}`,
  );
  console.log(
    `  ${TEXT}--dry-run${RESET}   ${DIM}Preview without making changes (tts only)${RESET}`,
  );
  console.log(
    `  ${TEXT}--force${RESET}     ${DIM}Skip confirmation prompts (tts only)${RESET}`,
  );
  console.log();
}

function showHelp(): void {
  showBanner();
  process.exit(0);
}

const generators = {
  demos: DemosGenerator,
  icons: IconsGenerator,
  opengraph: OpenGraphGenerator,
  playgrounds: PlaygroundsGenerator,
  tts: TextToSpeechGenerator,
};

type GeneratorName = keyof typeof generators;

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
  }

  const isWatch = args.includes("--watch");
  const isDryRun = args.includes("--dry-run");
  const isForce = args.includes("--force");
  const generatorNames = args.filter(
    (arg) => !arg.startsWith("--"),
  ) as GeneratorName[];

  if (generatorNames.length === 0 && args.length === 0) {
    showLogo();
    console.log();
  }

  // Default to build-time generators if none specified (excluding TTS)
  const toRun =
    generatorNames.length > 0
      ? generatorNames
      : (["demos", "icons", "opengraph", "playgrounds"] as GeneratorName[]);

  // Validate generator names
  for (const name of toRun) {
    if (!generators[name]) {
      console.log();
      console.log(`${pc.red("✗")} Unknown generator: ${pc.bold(name)}`);
      console.log();
      console.log(`${DIM}Available generators:${RESET}`);
      for (const key of Object.keys(generators)) {
        console.log(`  ${TEXT}${key}${RESET}`);
      }
      console.log();
      process.exit(1);
    }
  }

  const startTime = performance.now();
  let totalFiles = 0;

  // Run generators
  for (const name of toRun) {
    const GeneratorClass = generators[name];
    const generator =
      name === "tts"
        ? new TextToSpeechGenerator({ dryRun: isDryRun, force: isForce })
        : new GeneratorClass();

    if (isWatch && name === "playgrounds" && "watch" in generator) {
      await (generator as PlaygroundsGenerator).watch();
    } else {
      const result = await generator.run();
      totalFiles += result.files.length;
    }
  }

  if (toRun.length > 1) {
    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log();
    console.log(
      `${pc.green("✓")} ${TEXT}Generated ${totalFiles} files in ${duration}s${RESET}`,
    );
    console.log();
  }
}

main().catch((error) => {
  console.log();
  console.log(`${pc.red("✗")} ${pc.bold("Fatal error:")}`);
  console.log(
    `  ${DIM}${error instanceof Error ? error.message : String(error)}${RESET}`,
  );
  console.log();
  process.exit(1);
});
