"use client";

import { MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { playConcept } from "./sounds";
import styles from "./styles.module.css";

type ConceptType =
  | "sine"
  | "triangle"
  | "square"
  | "sawtooth"
  | "noise"
  | "noise-lowpass"
  | "noise-highpass"
  | "noise-bandpass"
  | "click"
  | "pop"
  | "tick"
  | "toggle"
  | "drop"
  | "refresh"
  | "success"
  | "error"
  | "warning"
  | "startup"
  | "envelope-fast"
  | "envelope-slow"
  | "frequency-low"
  | "frequency-mid"
  | "frequency-high"
  | "whoosh";

const CONCEPT_COLORS: Record<ConceptType, string> = {
  sine: "#3B82F6",
  triangle: "#A855F7",
  square: "#EC4899",
  sawtooth: "#F97316",
  noise: "#96c63c",
  "noise-lowpass": "#22C55E",
  "noise-highpass": "#06B6D4",
  "noise-bandpass": "#8B5CF6",
  click: "#EF4444",
  pop: "#FB923C",
  tick: "#FACC15",
  toggle: "#84CC16",
  drop: "#10B981",
  refresh: "#14B8A6",
  success: "#22C55E",
  error: "#F43F5E",
  warning: "#F59E0B",
  startup: "#6366F1",
  "envelope-fast": "#F472B6",
  "envelope-slow": "#C084FC",
  "frequency-low": "#E11D48",
  "frequency-mid": "#A855F7",
  "frequency-high": "#22D3EE",
  whoosh: "#818CF8",
};

const CONCEPTS: { type: ConceptType; label: string }[] = [
  { type: "sine", label: "Sine" },
  { type: "triangle", label: "Triangle" },
  { type: "square", label: "Square" },
  { type: "sawtooth", label: "Sawtooth" },
  { type: "noise", label: "Noise" },
  { type: "noise-lowpass", label: "Lowpass" },
  { type: "noise-highpass", label: "Highpass" },
  { type: "noise-bandpass", label: "Bandpass" },
  { type: "click", label: "Click" },
  { type: "pop", label: "Pop" },
  { type: "tick", label: "Tick" },
  { type: "toggle", label: "Toggle" },
  { type: "drop", label: "Drop" },
  { type: "refresh", label: "Refresh" },
  { type: "success", label: "Success" },
  { type: "error", label: "Error" },
  { type: "warning", label: "Warning" },
  { type: "startup", label: "Startup" },
  { type: "envelope-fast", label: "Fast" },
  { type: "envelope-slow", label: "Slow" },
  { type: "frequency-low", label: "Low" },
  { type: "frequency-mid", label: "Mid" },
  { type: "frequency-high", label: "High" },
  { type: "whoosh", label: "Whoosh" },
];

export function AudioConceptsDemo() {
  const [activeConcept, setActiveConcept] = useState<ConceptType | null>(null);

  const handlePlay = (type: ConceptType) => {
    const ctx = new AudioContext();
    playConcept(ctx, type);

    setActiveConcept(type);
    setTimeout(() => {
      setActiveConcept(null);
    }, 300);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {CONCEPTS.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            className={styles.concept}
            data-active={activeConcept === type}
            onClick={() => handlePlay(type)}
          >
            <ConceptVisual type={type} isActive={activeConcept === type} />
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ConceptVisual({
  type,
  isActive,
}: {
  type: ConceptType;
  isActive: boolean;
}) {
  const getPath = () => {
    switch (type) {
      case "sine":
        return "M 0 24 Q 12 4, 24 24 Q 36 44, 48 24 Q 60 4, 72 24 Q 84 44, 96 24";
      case "triangle":
        return "M 0 24 L 12 4 L 36 44 L 60 4 L 84 44 L 96 24";
      case "square":
        return "M 0 24 L 0 4 L 24 4 L 24 44 L 48 44 L 48 4 L 72 4 L 72 44 L 96 44 L 96 24";
      case "sawtooth":
        return "M 0 44 L 24 4 L 24 44 L 48 4 L 48 44 L 72 4 L 72 44 L 96 4";
      case "noise":
        return "M 0 24 L 6 14 L 12 32 L 18 10 L 24 36 L 30 18 L 36 28 L 42 12 L 48 34 L 54 20 L 60 26 L 66 16 L 72 30 L 78 19 L 84 27 L 90 15 L 96 24";
      case "noise-lowpass":
        return "M 0 24 C 24 24, 48 24, 60 26 C 72 30, 84 38, 96 44";
      case "noise-highpass":
        return "M 0 44 C 12 38, 24 30, 36 26 C 48 24, 72 24, 96 24";
      case "noise-bandpass":
        return "M 0 40 C 18 36, 30 24, 48 22 C 66 24, 78 36, 96 40";
      case "click":
        return "M 0 40 L 20 20 L 40 40 L 60 20 L 80 40 L 96 24";
      case "pop":
        return "M 0 40 Q 24 20, 48 24 Q 72 20, 96 40";
      case "tick":
        return "M 0 40 L 30 20 L 50 30 L 96 10";
      case "toggle":
        return "M 0 24 L 30 24 L 40 14 L 50 24 L 80 24 L 90 34 L 96 24";
      case "drop":
        return "M 0 20 L 48 44 L 96 20";
      case "refresh":
        return "M 0 44 L 48 20 L 96 44";
      case "success":
        return "M 0 40 L 20 30 L 40 20 L 60 30 L 80 20 L 96 10";
      case "error":
        return "M 0 20 L 30 40 L 60 20 L 90 40 L 96 30";
      case "warning":
        return "M 0 40 L 48 20 L 96 40";
      case "startup":
        return "M 0 40 Q 24 20, 48 24 Q 72 20, 96 40";
      case "envelope-fast":
        return "M 0 44 L 10 20 L 96 44";
      case "envelope-slow":
        return "M 0 44 Q 30 30, 60 20 Q 80 15, 96 20";
      case "frequency-low":
        return "M 0 24 Q 24 8, 48 24 Q 72 40, 96 24";
      case "frequency-mid":
        return "M 0 24 Q 12 4, 24 24 Q 36 44, 48 24 Q 60 4, 72 24 Q 84 44, 96 24";
      case "frequency-high":
        return "M 0 24 Q 6 4, 12 24 Q 18 44, 24 24 Q 30 4, 36 24 Q 42 44, 48 24 Q 54 4, 60 24 Q 66 44, 72 24 Q 78 4, 84 24 Q 90 44, 96 24";
      case "whoosh":
        return "M 0 40 Q 20 30, 40 24 Q 60 20, 80 24 Q 90 26, 96 30";
    }
  };

  return (
    <MotionConfig
      transition={{
        duration: 0.8,
      }}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 96 48"
        aria-label={`${type} waveform`}
        role="img"
        data-active={isActive}
      >
        <motion.path
          d={getPath()}
          className={styles.path}
          initial={false}
          animate={{
            pathLength: isActive ? [0, 1] : 1,
            stroke: isActive ? CONCEPT_COLORS[type] : "#71717A",
          }}
          transition={{
            pathLength: { duration: 0.8 },
            stroke: { duration: 0.4 },
          }}
        />
      </svg>
    </MotionConfig>
  );
}
