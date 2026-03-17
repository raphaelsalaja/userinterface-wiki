"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface Option {
  id: string;
  label: string;
  value: string;
}

const LINES: Option[] = [
  { id: "line-none", label: "None", value: "none" },
  { id: "line-underline", label: "Underline", value: "underline" },
  { id: "line-overline", label: "Overline", value: "overline" },
  { id: "line-through", label: "Line-through", value: "line-through" },
];

const LINE_STYLES: Option[] = [
  { id: "style-solid", label: "Solid", value: "solid" },
  { id: "style-double", label: "Double", value: "double" },
  { id: "style-dotted", label: "Dotted", value: "dotted" },
  { id: "style-dashed", label: "Dashed", value: "dashed" },
  { id: "style-wavy", label: "Wavy", value: "wavy" },
];

const SKIP_INK: Option[] = [
  { id: "skip-auto", label: "Auto", value: "auto" },
  { id: "skip-all", label: "All", value: "all" },
  { id: "skip-none", label: "None", value: "none" },
];

const EMPHASIS: Option[] = [
  { id: "em-none", label: "None", value: "none" },
  { id: "em-dot", label: "Dot", value: "filled dot" },
  { id: "em-circle", label: "Circle", value: "open circle" },
  { id: "em-triangle", label: "Triangle", value: "filled triangle" },
  { id: "em-sesame", label: "Sesame", value: "filled sesame" },
];

const SAMPLE =
  "Typography is the art and technique of arranging type to make written language legible and appealing.";

export function TextDecoration() {
  const [line, setLine] = useState("line-underline");
  const [lineStyle, setLineStyle] = useState("style-solid");
  const [thickness, setThickness] = useState(2);
  const [offset, setOffset] = useState(3);
  const [skipInk, setSkipInk] = useState("skip-auto");
  const [emphasis, setEmphasis] = useState("em-none");

  const currentLine = LINES.find((l) => l.id === line);
  const currentStyle = LINE_STYLES.find((s) => s.id === lineStyle);
  const currentSkipInk = SKIP_INK.find((s) => s.id === skipInk);
  const currentEmphasis = EMPHASIS.find((e) => e.id === emphasis);

  const decoStyle: React.CSSProperties =
    currentLine?.value === "none"
      ? { textDecoration: "none" }
      : {
          textDecorationLine: currentLine?.value,
          textDecorationStyle:
            currentStyle?.value as React.CSSProperties["textDecorationStyle"],
          textDecorationThickness: `${thickness}px`,
          textDecorationColor: "var(--gray-12)",
          textUnderlineOffset: `${offset}px`,
          textDecorationSkipInk:
            currentSkipInk?.value as React.CSSProperties["textDecorationSkipInk"],
        };

  const emphasisStyle: React.CSSProperties =
    currentEmphasis?.value === "none"
      ? {}
      : {
          textEmphasisStyle: currentEmphasis?.value,
          textEmphasisColor: "var(--gray-12)",
        };

  const codeLines: string[] = [];
  if (currentLine?.value !== "none") {
    codeLines.push(
      `text-decoration: ${currentLine?.value} ${currentStyle?.value} ${thickness}px;`,
    );
    codeLines.push(`text-underline-offset: ${offset}px;`);
    codeLines.push(`text-decoration-skip-ink: ${currentSkipInk?.value};`);
  }
  if (currentEmphasis?.value !== "none") {
    codeLines.push(`text-emphasis: ${currentEmphasis?.value};`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-decoration-line</span>
        <div className={styles.pills}>
          {LINES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={line === opt.id}
              onClick={() => setLine(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-decoration-style</span>
        <div className={styles.pills}>
          {LINE_STYLES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={lineStyle === opt.id}
              onClick={() => setLineStyle(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <label className={styles.control}>
          <span className={styles["section-label"]}>
            thickness <code className={styles.val}>{thickness}px</code>
          </span>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
        <label className={styles.control}>
          <span className={styles["section-label"]}>
            underline-offset <code className={styles.val}>{offset}px</code>
          </span>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
      </div>
      <div className={styles.section}>
        <span className={styles["section-label"]}>
          text-decoration-skip-ink
        </span>
        <div className={styles.pills}>
          {SKIP_INK.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={skipInk === opt.id}
              onClick={() => setSkipInk(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-emphasis</span>
        <div className={styles.pills}>
          {EMPHASIS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={emphasis === opt.id}
              onClick={() => setEmphasis(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={styles.preview}
        style={{ ...decoStyle, ...emphasisStyle }}
      >
        {SAMPLE}
      </div>
      {codeLines.length > 0 && (
        <div className={styles.output}>
          <code className={styles["output-code"]}>{codeLines.join("\n")}</code>
        </div>
      )}
    </div>
  );
}
