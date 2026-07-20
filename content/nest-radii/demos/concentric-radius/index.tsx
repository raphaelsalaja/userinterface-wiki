"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Controls } from "@/components/primitives/controls";
import styles from "./styles.module.css";

export function ConcentricRadius() {
  const [concentric, setConcentric] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.outer} data-concentric={concentric}>
        <div className={styles.inner}>
          <span className={styles.label}>
            {concentric ? "16px outer, 8px inner" : "16px outer, 16px inner"}
          </span>
        </div>
      </div>

      <Controls position="bottom">
        <Button
          onClick={() => setConcentric(!concentric)}
          data-active={concentric}
        >
          Toggle
        </Button>
      </Controls>
    </div>
  );
}
