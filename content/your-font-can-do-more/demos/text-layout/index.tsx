"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface Option {
  id: string;
  label: string;
  value: string;
}

const WRAP_MODES: Option[] = [
  { id: "wrap-pretty", label: "Pretty", value: "pretty" },
  { id: "wrap-balance", label: "Balance", value: "balance" },
  { id: "wrap-stable", label: "Stable", value: "stable" },
  { id: "wrap-nowrap", label: "Nowrap", value: "nowrap" },
];

const ALIGN_MODES: Option[] = [
  { id: "align-left", label: "Left", value: "left" },
  { id: "align-center", label: "Center", value: "center" },
  { id: "align-right", label: "Right", value: "right" },
  { id: "align-justify", label: "Justify", value: "justify" },
];

const OVERFLOW_MODES: Option[] = [
  { id: "overflow-visible", label: "Visible", value: "visible" },
  { id: "overflow-clip", label: "Clip", value: "clip" },
  { id: "overflow-ellipsis", label: "Ellipsis", value: "ellipsis" },
];

const SAMPLE =
  "One of the most famous lighthouses of antiquity was the pharos of Alexandria, which ancient writers included among the Seven Wonders of the World. It might naturally be supposed that the founder of so remarkable a monument of architectural skill would be well known; yet while Strabo and Pliny ascribe its erection to Ptolemæus Philadelphus, the wisest of the Ptolemean kings of Egypt, by Tzetzes the honour is given to Cleopatra.";

export function TextLayout() {
  const [wrap, setWrap] = useState("wrap-pretty");
  const [align, setAlign] = useState("align-left");
  const [overflow, setOverflow] = useState("overflow-visible");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [indent, setIndent] = useState(0);

  const currentWrap = WRAP_MODES.find((w) => w.id === wrap);
  const currentAlign = ALIGN_MODES.find((a) => a.id === align);
  const currentOverflow = OVERFLOW_MODES.find((o) => o.id === overflow);

  const isEllipsis = currentOverflow?.value === "ellipsis";
  const isClip = currentOverflow?.value === "clip";

  const previewStyle: React.CSSProperties = {
    textWrap: currentWrap?.value as React.CSSProperties["textWrap"],
    textAlign: currentAlign?.value as React.CSSProperties["textAlign"],
    letterSpacing: `${letterSpacing}em`,
    wordSpacing: `${wordSpacing}em`,
    lineHeight,
    textIndent: `${indent}px`,
    ...(isEllipsis
      ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
      : {}),
    ...(isClip ? { overflow: "hidden", whiteSpace: "nowrap" } : {}),
  };

  const codeLines: string[] = [];
  if (currentWrap?.value !== "pretty")
    codeLines.push(`text-wrap: ${currentWrap?.value};`);
  if (currentAlign?.value !== "left")
    codeLines.push(`text-align: ${currentAlign?.value};`);
  if (letterSpacing !== 0)
    codeLines.push(`letter-spacing: ${letterSpacing}em;`);
  if (wordSpacing !== 0) codeLines.push(`word-spacing: ${wordSpacing}em;`);
  if (lineHeight !== 1.6) codeLines.push(`line-height: ${lineHeight};`);
  if (indent !== 0) codeLines.push(`text-indent: ${indent}px;`);
  if (isEllipsis) codeLines.push("text-overflow: ellipsis;");
  if (isClip) codeLines.push("overflow: hidden;");

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-wrap</span>
        <div className={styles.pills}>
          {WRAP_MODES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={wrap === opt.id}
              onClick={() => setWrap(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-align</span>
        <div className={styles.pills}>
          {ALIGN_MODES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={align === opt.id}
              onClick={() => setAlign(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-overflow</span>
        <div className={styles.pills}>
          {OVERFLOW_MODES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={overflow === opt.id}
              onClick={() => setOverflow(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.sliders}>
        <label className={styles.control}>
          <span className={styles["section-label"]}>
            letter-spacing{" "}
            <code className={styles.val}>{letterSpacing.toFixed(2)}em</code>
          </span>
          <input
            type="range"
            min={-0.05}
            max={0.2}
            step={0.005}
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
        <label className={styles.control}>
          <span className={styles["section-label"]}>
            word-spacing{" "}
            <code className={styles.val}>{wordSpacing.toFixed(2)}em</code>
          </span>
          <input
            type="range"
            min={-0.1}
            max={0.5}
            step={0.01}
            value={wordSpacing}
            onChange={(e) => setWordSpacing(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
        <label className={styles.control}>
          <span className={styles["section-label"]}>
            line-height{" "}
            <code className={styles.val}>{lineHeight.toFixed(1)}</code>
          </span>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.1}
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
        <label className={styles.control}>
          <span className={styles["section-label"]}>
            text-indent <code className={styles.val}>{indent}px</code>
          </span>
          <input
            type="range"
            min={0}
            max={80}
            step={4}
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
      </div>
      <div className={styles.preview} style={previewStyle}>
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
