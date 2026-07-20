"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Controls } from "@/components/primitives/controls";
import styles from "./styles.module.css";

const SURFACES = ["one", "two", "three"] as const;

export function AlphaBorder() {
  const [alpha, setAlpha] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.surfaces}>
        {SURFACES.map((surface) => (
          <div key={surface} className={styles.surface} data-surface={surface}>
            <div className={styles.card} data-alpha={alpha}>
              <span className={styles.label}>{alpha ? "alpha" : "fixed"}</span>
            </div>
          </div>
        ))}
      </div>

      <Controls position="bottom">
        <Button onClick={() => setAlpha(!alpha)} data-active={alpha}>
          Toggle
        </Button>
      </Controls>
    </div>
  );
}
