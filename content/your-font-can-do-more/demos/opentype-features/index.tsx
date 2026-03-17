"use client";

import { useState } from "react";
import { ALL_FEATURES, DEFAULT_ON, settingsOutput } from "./data";
import styles from "./styles.module.css";

export function OpentypeFeatures() {
  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(DEFAULT_ON),
  );

  function toggle(tag: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {ALL_FEATURES.map((f) => {
          const isOn = enabled.has(f.tag);
          return (
            <button
              key={f.tag}
              type="button"
              className={styles.card}
              data-active={isOn}
              onClick={() => toggle(f.tag)}
            >
              <div className={styles.top}>
                <code className={styles.tag}>{f.tag}</code>
                <span className={styles.name}>{f.name}</span>
              </div>
              <span
                className={styles.sample}
                style={{
                  fontFeatureSettings: `"${f.tag}" ${isOn ? 1 : 0}`,
                }}
              >
                {f.sample}
              </span>
            </button>
          );
        })}
      </div>
      <code className={styles.output}>{settingsOutput(enabled)}</code>
    </div>
  );
}
