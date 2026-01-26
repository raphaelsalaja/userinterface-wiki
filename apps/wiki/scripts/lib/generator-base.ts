import { intro, log, outro } from "@clack/prompts";
import pc from "picocolors";

export interface GeneratorConfig {
  name: string;
  label: string;
}

export interface GeneratedFile {
  name: string;
  path: string;
  size?: number;
}

export abstract class Generator {
  protected config: GeneratorConfig;
  protected startTime: number = 0;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  async run(): Promise<void> {
    this.startTime = performance.now();
    intro(pc.bgCyan(pc.black(` ${this.config.label} `)));

    try {
      const files = await this.generate();
      this.printResults(files);
    } catch (error) {
      this.handleError(error);
    }
  }

  protected abstract generate(): Promise<GeneratedFile[]>;

  protected printResults(files: GeneratedFile[]): void {
    for (const file of files) {
      const sizeInfo = file.size
        ? ` ${pc.gray(`(${(file.size / 1024).toFixed(1)} kB)`)}`
        : "";
      log.success(`${pc.dim(file.name)}${sizeInfo}`);
    }

    const duration = ((performance.now() - this.startTime) / 1000).toFixed(2);
    outro(pc.green(`${files.length} ${this.config.name} in ${duration}s`));
  }

  protected handleError(error: unknown): void {
    const duration = ((performance.now() - this.startTime) / 1000).toFixed(2);
    outro(
      pc.red(
        `Failed to generate ${this.config.name}: ${error instanceof Error ? error.message : String(error)} (${duration}s)`,
      ),
    );
    process.exit(1);
  }
}
