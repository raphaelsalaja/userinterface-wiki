"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Controls } from "@/components/primitives/controls";
import styles from "./styles.module.css";

export function BalancedHeading() {
  const [balanced, setBalanced] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <h3 className={styles.heading} data-balanced={balanced}>
          Everything you need to know about wrapping headlines properly
        </h3>
        <span className={styles.label}>
          {balanced ? "text-wrap: balance" : "text-wrap: wrap"}
        </span>
      </div>

      <Controls position="bottom">
        <Button onClick={() => setBalanced(!balanced)} data-active={balanced}>
          Toggle
        </Button>
      </Controls>
    </div>
  );
}
