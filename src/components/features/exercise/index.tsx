"use client";

import { useState } from "react";
import { Playground } from "@/components/features/playground";
import { Button } from "@/components/primitives/button";
import styles from "./styles.module.css";

interface ExerciseFiles {
  files: Record<string, string>;
}

interface ExerciseProps {
  /** What the reader should build, e.g. "Add squash and stretch on entry." */
  prompt: string;
  starter: ExerciseFiles;
  solution: ExerciseFiles;
}

/**
 * Learn-by-recreating exercise: an editable starter sandbox with a
 * "Reveal solution" toggle that swaps in the finished implementation.
 */
export function Exercise({ prompt, starter, solution }: ExerciseProps) {
  const [revealed, setRevealed] = useState(false);
  const active = revealed ? solution : starter;

  return (
    <div className={styles.exercise}>
      <p className={styles.prompt}>
        <span className={styles.badge}>Exercise</span>
        {prompt}
      </p>
      <Playground
        key={revealed ? "solution" : "starter"}
        files={active.files}
        title={revealed ? "Solution" : "Your Turn"}
        actions={
          <Button
            variant="ghost"
            size="small"
            onClick={() => setRevealed(!revealed)}
            aria-pressed={revealed}
          >
            Toggle solution
          </Button>
        }
      />
    </div>
  );
}
