import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    external: ["next"],
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    clean: false,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
