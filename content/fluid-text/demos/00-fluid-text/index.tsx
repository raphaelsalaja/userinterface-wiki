"use client";

import { Calligraph } from "calligraph";
import { useState } from "react";
import styles from "./styles.module.css";

const sizes = [24, 32, 40, 48, 56];

const weights = [
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
];

const aligns = ["left", "center", "right"] as const;
type Align = (typeof aligns)[number];

const justifyMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

export function FluidTextDemo() {
  const [words, setWords] = useState("Craft, Creative, Create");
  const [index, setIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(2);
  const [weightIndex, setWeightIndex] = useState(2);
  const [alignIndex, setAlignIndex] = useState(1);

  const sequence = words
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  const currentWord = sequence[index % sequence.length] ?? "";
  const align: Align = aligns[alignIndex];

  function handleMorph() {
    if (sequence.length > 1) {
      setIndex((i) => (i + 1) % sequence.length);
    }
  }

  function handleReverse() {
    if (sequence.length > 1) {
      setIndex((i) => (i - 1 + sequence.length) % sequence.length);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          className={styles.display}
          style={{ justifyContent: justifyMap[align] }}
        >
          <Calligraph
            style={{
              fontSize: sizes[sizeIndex],
              fontWeight: weights[weightIndex].value,
              justifyContent: justifyMap[align],
            }}
          >
            {currentWord}
          </Calligraph>
        </div>

        <div className={styles.settings}>
          <label className={styles.row}>
            <span className={styles.label}>Words</span>
            <input
              type="text"
              value={words}
              onChange={(e) => {
                setWords(e.target.value);
                setIndex(0);
              }}
              className={styles.input}
            />
          </label>
          <div className={styles.separator} />
          <div className={styles.row}>
            <span className={styles.label}>Font Size</span>
            <button
              type="button"
              className={styles.value}
              onClick={() => setSizeIndex((sizeIndex + 1) % sizes.length)}
            >
              {sizes[sizeIndex]}pt
            </button>
          </div>
          <div className={styles.separator} />
          <div className={styles.row}>
            <span className={styles.label}>Font Weight</span>
            <button
              type="button"
              className={styles.value}
              onClick={() => setWeightIndex((weightIndex + 1) % weights.length)}
            >
              {weights[weightIndex].label}
            </button>
          </div>
          <div className={styles.separator} />
          <div className={styles.row}>
            <span className={styles.label}>Text Alignment</span>
            <button
              type="button"
              className={styles.value}
              onClick={() => setAlignIndex((alignIndex + 1) % aligns.length)}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleReverse}
            className={styles.action}
            data-variant="secondary"
          >
            Reverse
          </button>
          <button
            type="button"
            onClick={handleMorph}
            className={styles.action}
            data-variant="primary"
          >
            Morph
          </button>
        </div>
      </div>
    </div>
  );
}
