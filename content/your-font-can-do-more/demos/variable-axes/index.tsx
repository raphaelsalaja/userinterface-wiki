"use client";

import { useState } from "react";
import styles from "./styles.module.css";

const SAMPLE =
  "Hamburgefonstiv — The quick brown fox jumps over the lazy dog. 0123456789";

export function VariableAxes() {
  const [weight, setWeight] = useState(400);
  const [size, setSize] = useState(32);
  const [opticalSizing, setOpticalSizing] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <label className={styles.control}>
          <span className={styles.label}>
            Weight <code className={styles.value}>{weight}</code>
          </span>
          <input
            type="range"
            min={100}
            max={900}
            step={1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
        <label className={styles.control}>
          <span className={styles.label}>
            Size <code className={styles.value}>{size}px</code>
          </span>
          <input
            type="range"
            min={10}
            max={72}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className={styles.slider}
          />
        </label>
        <button
          type="button"
          className={styles.toggle}
          data-active={opticalSizing}
          onClick={() => setOpticalSizing((v) => !v)}
        >
          Optical Sizing
        </button>
      </div>
      <div
        className={styles.preview}
        style={{
          fontWeight: weight,
          fontSize: `${size}px`,
          fontOpticalSizing: opticalSizing ? "auto" : "none",
        }}
      >
        {SAMPLE}
      </div>
      <div className={styles.output}>
        <code className={styles["output-code"]}>
          {`font-weight: ${weight}; font-size: ${size}px; font-optical-sizing: ${opticalSizing ? "auto" : "none"};`}
        </code>
      </div>
    </div>
  );
}
