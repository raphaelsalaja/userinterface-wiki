import { IconsGenerator } from "./generators/icons";
import { OpenGraphGenerator } from "./generators/opengraph";
import { PlaygroundsGenerator } from "./generators/playgrounds";
import { TextToSpeechGenerator } from "./generators/text-to-speech";

const generators = {
  icons: IconsGenerator,
  opengraph: OpenGraphGenerator,
  playgrounds: PlaygroundsGenerator,
  tts: TextToSpeechGenerator,
};

type GeneratorName = keyof typeof generators;

async function main() {
  const args = process.argv.slice(2);
  const isWatch = args.includes("--watch");
  const isDryRun = args.includes("--dry-run");
  const isForce = args.includes("--force");
  const generatorNames = args.filter(
    (arg) => !arg.startsWith("--"),
  ) as GeneratorName[];

  // Default to build-time generators if none specified (excluding TTS)
  const toRun =
    generatorNames.length > 0
      ? generatorNames
      : (["icons", "opengraph", "playgrounds"] as GeneratorName[]);

  // Validate generator names
  for (const name of toRun) {
    if (!generators[name]) {
      console.error(`Unknown generator: ${name}`);
      console.error(`Available: ${Object.keys(generators).join(", ")}`);
      process.exit(1);
    }
  }

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
      await generator.run();
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
