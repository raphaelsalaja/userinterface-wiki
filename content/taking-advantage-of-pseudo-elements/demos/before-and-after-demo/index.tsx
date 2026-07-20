"use client";

import { Button } from "@/components/primitives/button";
import styles from "./styles.module.css";

export function BeforeAndAfterDemo() {
  return (
    <div className={styles.container}>
      <Button variant="ghost">::before</Button>
    </div>
  );
}
