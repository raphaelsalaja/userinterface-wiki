"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface TransformOption {
  id: string;
  label: string;
  style: React.CSSProperties;
  code: string;
}

const TRANSFORMS: TransformOption[] = [
  {
    id: "tf-none",
    label: "None",
    style: { textTransform: "none" },
    code: "text-transform: none;",
  },
  {
    id: "tf-upper",
    label: "Uppercase",
    style: { textTransform: "uppercase" },
    code: "text-transform: uppercase;",
  },
  {
    id: "tf-lower",
    label: "Lowercase",
    style: { textTransform: "lowercase" },
    code: "text-transform: lowercase;",
  },
  {
    id: "tf-cap",
    label: "Capitalize",
    style: { textTransform: "capitalize" },
    code: "text-transform: capitalize;",
  },
];

const CAPS: TransformOption[] = [
  {
    id: "cap-normal",
    label: "Normal",
    style: { fontVariantCaps: "normal" },
    code: "font-variant-caps: normal;",
  },
  {
    id: "cap-small",
    label: "Small Caps",
    style: { fontVariantCaps: "small-caps" },
    code: "font-variant-caps: small-caps;",
  },
  {
    id: "cap-all-small",
    label: "All Small Caps",
    style: { fontVariantCaps: "all-small-caps" },
    code: "font-variant-caps: all-small-caps;",
  },
  {
    id: "cap-petite",
    label: "Petite Caps",
    style: { fontVariantCaps: "petite-caps" },
    code: "font-variant-caps: petite-caps;",
  },
  {
    id: "cap-unicase",
    label: "Unicase",
    style: { fontVariantCaps: "unicase" },
    code: "font-variant-caps: unicase;",
  },
];

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog";

export function TextTransform() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [activeTransform, setActiveTransform] = useState("tf-none");
  const [activeCaps, setActiveCaps] = useState("cap-normal");

  const currentTransform = TRANSFORMS.find((t) => t.id === activeTransform);
  const currentCaps = CAPS.find((c) => c.id === activeCaps);

  const combinedStyle: React.CSSProperties = {
    ...currentTransform?.style,
    ...currentCaps?.style,
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <div className={styles.section}>
        <span className={styles["section-label"]}>text-transform</span>
        <div className={styles.pills}>
          {TRANSFORMS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={activeTransform === opt.id}
              onClick={() => setActiveTransform(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles["section-label"]}>font-variant-caps</span>
        <div className={styles.pills}>
          {CAPS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.pill}
              data-active={activeCaps === opt.id}
              onClick={() => setActiveCaps(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.preview} style={combinedStyle}>
        {text || DEFAULT_TEXT}
      </div>
      <div className={styles.output}>
        <code className={styles["output-code"]}>
          {currentTransform?.code}
          {"\n"}
          {currentCaps?.code}
        </code>
      </div>
    </div>
  );
}
