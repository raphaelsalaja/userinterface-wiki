"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface RenderMode {
  id: string;
  label: string;
  css: React.CSSProperties;
  code: string;
}

const MODES: RenderMode[] = [
  {
    id: "mode-legibility",
    label: "optimizeLegibility",
    css: {
      textRendering: "optimizeLegibility",
      fontKerning: "normal",
      WebkitFontSmoothing: "antialiased",
    },
    code: "text-rendering: optimizeLegibility;\nfont-kerning: normal;\n-webkit-font-smoothing: antialiased;",
  },
  {
    id: "mode-speed",
    label: "optimizeSpeed",
    css: {
      textRendering: "optimizeSpeed",
      fontKerning: "none",
      WebkitFontSmoothing: "auto",
    },
    code: "text-rendering: optimizeSpeed;\nfont-kerning: none;\n-webkit-font-smoothing: auto;",
  },
  {
    id: "mode-geometric",
    label: "geometricPrecision",
    css: {
      textRendering: "geometricPrecision",
      fontKerning: "normal",
      WebkitFontSmoothing: "antialiased",
    },
    code: "text-rendering: geometricPrecision;\nfont-kerning: normal;\n-webkit-font-smoothing: antialiased;",
  },
  {
    id: "mode-auto",
    label: "auto",
    css: {
      textRendering: "auto",
      fontKerning: "auto",
      WebkitFontSmoothing: "auto",
    },
    code: "text-rendering: auto;\nfont-kerning: auto;\n-webkit-font-smoothing: auto;",
  },
];

const SAMPLE_HEADING = "WAVE Typography AVA";
const SAMPLE_BODY =
  "The quick brown fox jumps over the lazy dog. Kerning affects spacing between specific character pairs like AV, To, and We. At larger sizes, differences in rendering become more visible — especially around curves and diagonal strokes.";

export function TextRendering() {
  const [active, setActive] = useState("mode-legibility");
  const current = MODES.find((m) => m.id === active);

  return (
    <div className={styles.container}>
      <div className={styles.pills}>
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={styles.pill}
            data-active={active === mode.id}
            onClick={() => setActive(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className={styles.preview} style={current?.css}>
        <span className={styles.heading}>{SAMPLE_HEADING}</span>
        <span className={styles.body}>{SAMPLE_BODY}</span>
      </div>
      <div className={styles.output}>
        <code className={styles["output-code"]}>{current?.code}</code>
      </div>
    </div>
  );
}
