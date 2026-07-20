"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Controls } from "@/components/primitives/controls";
import styles from "./styles.module.css";

export function LayeredShadows() {
  const [layered, setLayered] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.card} data-layered={layered}>
        <span className={styles.label}>
          {layered ? "Three layers" : "One shadow"}
        </span>
      </div>

      <Controls position="bottom">
        <Button onClick={() => setLayered(!layered)} data-active={layered}>
          Toggle
        </Button>
      </Controls>
    </div>
  );
}
