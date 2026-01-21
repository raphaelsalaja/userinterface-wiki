"use client";

import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "@/components/button";
import { ArrowRotateClockwiseIcon } from "@/icons";
import { getPrerequisites } from "./index.prerequisites";
import styles from "./styles.module.css";

interface PlaygroundProps {
  files: Record<string, string>;
  activeFile: string;
}

function PlaygroundContent() {
  const { sandpack } = useSandpack();

  const handleRefresh = () => {
    sandpack.runSandpack();
  };

  const props = {
    button: {
      variant: "ghost",
      size: "small",
      aspect: "square",
    } as const,
  };

  return (
    <React.Fragment>
      <div className={styles.header}>
        <span className={styles.title}>Code Playground</span>
        <div className={styles.actions}>
          <Button {...props.button} onClick={handleRefresh}>
            <ArrowRotateClockwiseIcon size={14} />
          </Button>
        </div>
      </div>
      <div className={styles.layout}>
        <SandpackCodeEditor
          showTabs
          showLineNumbers={true}
          showRunButton={false}
          closableTabs={false}
          style={{ height: 384 }}
          className={styles.editor}
        />
        <SandpackPreview
          showNavigator={false}
          showOpenNewtab={false}
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          showRestartButton={false}
          showSandpackErrorOverlay={false}
          style={{ height: 384 }}
          className={styles.preview}
        />
      </div>
    </React.Fragment>
  );
}

export function Playground({ files }: PlaygroundProps) {
  const { resolvedTheme } = useTheme();
  const prerequisites = getPrerequisites(resolvedTheme);

  return (
    <div className={styles.root} data-prose-type="code-playground">
      <SandpackProvider
        template="react-ts"
        theme={{
          colors: {
            surface1: "var(--gray-1)",
            surface2: "var(--gray-4)",
            accent: "var(--gray-12)",
          },
          syntax: {
            plain: "var(--gray-11)",
            comment: { color: "var(--green-11)", fontStyle: "italic" },
            keyword: "var(--purple-11)",
            definition: "var(--amber-11)",
            punctuation: "var(--gray-10)",
            property: "var(--sky-11)",
            tag: "var(--blue-11)",
            static: "var(--cyan-11)",
            string: "var(--orange-11)",
          },
        }}
        customSetup={{
          dependencies: {
            motion: "latest",
            "@radix-ui/themes": "latest",
            "next-themes": "latest",
          },
        }}
        files={{
          ...prerequisites,
          ...files,
        }}
        options={{ visibleFiles: Object.keys(files) }}
      >
        <PlaygroundContent />
      </SandpackProvider>
    </div>
  );
}
