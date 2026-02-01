import * as p from "@clack/prompts";
import pc from "picocolors";

const DIM = "\x1b[38;5;102m";
const TEXT = "\x1b[38;5;145m";
const RESET = "\x1b[0m";

export interface GeneratorConfig {
  name: string;
  label: string;
}

export interface GeneratedFile {
  name: string;
  path: string;
  size?: number;
}

export interface GeneratorResult {
  files: GeneratedFile[];
  duration: number;
  error?: Error;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} kB`;
}

export abstract class Generator {
  protected config: GeneratorConfig;
  protected startTime: number = 0;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  protected info(message: string): void {
    p.log.info(message);
  }

  protected warn(message: string): void {
    p.log.warn(pc.yellow(message));
  }

  protected step(message: string): void {
    p.log.step(message);
  }

  async run(): Promise<GeneratorResult> {
    this.startTime = performance.now();
    p.intro(pc.bgCyan(pc.black(` ${this.config.label} `)));

    try {
      const files = await this.generate();
      const duration = (performance.now() - this.startTime) / 1000;
      this.printResults(files, duration);
      return { files, duration };
    } catch (error) {
      const duration = (performance.now() - this.startTime) / 1000;
      this.handleError(error);
      return { files: [], duration, error: error as Error };
    }
  }

  protected abstract generate(): Promise<GeneratedFile[]>;

  protected printResults(files: GeneratedFile[], duration: number): void {
    if (files.length === 0) {
      p.outro(`${DIM}No ${this.config.name} generated${RESET}`);
      return;
    }

    const resultLines: string[] = [];

    for (const file of files) {
      const sizeInfo = file.size
        ? ` ${DIM}${formatSize(file.size)}${RESET}`
        : "";
      resultLines.push(
        `${pc.green("✓")} ${TEXT}${file.name}${RESET}${sizeInfo}`,
      );
    }

    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const sizeNote =
      totalSize > 0 ? ` ${DIM}(${formatSize(totalSize)} total)${RESET}` : "";

    p.note(
      resultLines.join("\n"),
      pc.green(`${files.length} ${this.config.name}${sizeNote}`),
    );
    p.outro(`${TEXT}Done in ${duration.toFixed(2)}s${RESET}`);
  }

  protected handleError(error: unknown): void {
    const duration = ((performance.now() - this.startTime) / 1000).toFixed(2);
    const message = error instanceof Error ? error.message : String(error);

    p.log.error(pc.red(`Failed: ${message}`));
    p.outro(
      `${pc.red("✗")} ${DIM}${this.config.name} failed in ${duration}s${RESET}`,
    );
    process.exit(1);
  }
}

export { pc, p, DIM, TEXT, RESET, formatSize };
