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
import { Bleed } from "../bleed";
import { getPrerequisites } from "./index.prerequisites";
import styles from "./styles.module.css";

interface PlaygroundProps {
  files: Record<string, string>;
}

const PANEL_HEIGHT = 384;

const BUTTON_PROPS = {
  variant: "ghost",
  size: "small",
  aspect: "square",
} as const;

const SANDPACK_THEME = {
  colors: {
    surface1: "var(--gray-1)",
    surface2: "var(--gray-4)",
    surface3: "var(--gray-3)",
    accent: "var(--gray-12)",
  },
  syntax: {
    plain: "var(--gray-11)",
    comment: { color: "var(--green-11)", fontStyle: "italic" as const },
    keyword: "var(--purple-11)",
    definition: "var(--amber-11)",
    punctuation: "var(--gray-10)",
    property: "var(--sky-11)",
    tag: "var(--blue-11)",
    static: "var(--cyan-11)",
    string: "var(--orange-11)",
  },
};

const SANDPACK_DEPENDENCIES = {
  motion: "latest",
  "@radix-ui/colors": "latest",
  "next-themes": "latest",
};

function PlaygroundContent() {
  const { sandpack } = useSandpack();

  const handleRefresh = () => {
    sandpack.runSandpack();
  };

  return (
    <React.Fragment>
      <div className={styles.header}>
        <span className={styles.title}>Code Playground</span>
        <div className={styles.actions}>
          <Button {...BUTTON_PROPS} onClick={handleRefresh}>
            <ArrowRotateClockwiseIcon size={14} />
          </Button>
        </div>
      </div>
      <div className={styles.layout}>
        <SandpackCodeEditor
          showTabs
          showLineNumbers
          showRunButton={false}
          closableTabs={false}
          style={{ height: PANEL_HEIGHT }}
          className={styles.editor}
        />
        <SandpackPreview
          showNavigator={false}
          showOpenNewtab={false}
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          showRestartButton={false}
          showSandpackErrorOverlay={false}
          style={{ height: PANEL_HEIGHT }}
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
    <Bleed amount={48}>
      <div className={styles.root} data-prose-type="code-playground">
        <SandpackProvider
          template="react-ts"
          theme={SANDPACK_THEME}
          customSetup={{ dependencies: SANDPACK_DEPENDENCIES }}
          files={{ ...prerequisites, ...files }}
          options={{
            visibleFiles: Object.keys(files),
          }}
        >
          <PlaygroundContent />
        </SandpackProvider>
      </div>
    </Bleed>
  );
}
