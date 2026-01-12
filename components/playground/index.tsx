"use client";

import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { ArrowIcon } from "@/icons";
import styles from "./styles.module.css";

const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
});
`;

interface PlaygroundProps {
  files: Record<string, string>;
  template?: SandpackPredefinedTemplate;
  dependencies?: Record<string, string>;
  activeFile?: string;
  showPreview?: boolean;
  previewOnly?: boolean;
  previewHeight?: number;
  editorHeight?: number;
}

function RefreshButton() {
  const { sandpack } = useSandpack();

  return (
    <button
      type="button"
      className={styles.refreshButton}
      onClick={() => sandpack.runSandpack()}
      aria-label="Refresh preview"
    >
      <ArrowIcon size={14} />
    </button>
  );
}

export function Playground({
  files,
  dependencies,
  activeFile,
}: PlaygroundProps) {
  return (
    <div className={styles.root} data-prose-type="code-playground">
      <SandpackProvider
        template="vite-react"
        customSetup={{
          dependencies: {
            motion: "latest",
            ...dependencies,
          },
        }}
        files={{
          "/vite.config.ts": { code: viteConfig, hidden: true },
          ...files,
        }}
        options={{
          activeFile,
          visibleFiles: Object.keys(files),
        }}
      >
        <div className={styles.header}>
          <span className={styles.title}>Playground</span>
          <RefreshButton />
        </div>
        <div className={styles.layout}>
          <div className={styles.previewWrapper}>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              showSandpackErrorOverlay={false}
              style={{ height: 384 }}
            />
          </div>
          <div className={styles.editorWrapper}>
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              closableTabs={false}
              style={{ height: 384 }}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}
