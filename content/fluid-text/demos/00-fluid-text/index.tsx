"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import { useRef, useState } from "react";
import styles from "./styles.module.css";

function computeLCS(oldStr: string, newStr: string): [number, number][] {
  const m = oldStr.length;
  const n = newStr.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else if (oldStr[i - 1] === newStr[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const pairs: [number, number][] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (oldStr[i - 1] === newStr[j - 1]) {
      pairs.unshift([i - 1, j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return pairs;
}

interface FluidTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  transition?: Transition;
}

function FluidText({ children, className, style, transition }: FluidTextProps) {
  const nextIdRef = useRef(children.length);
  const enteringKeysRef = useRef<Set<string>>(new Set());

  const [prevText, setPrevText] = useState(children);
  const [charKeys, setCharKeys] = useState<string[]>(() =>
    children.split("").map((_, i) => `c${i}`),
  );

  if (children !== prevText) {
    const matches = computeLCS(prevText, children);
    const newKeys: string[] = new Array(children.length).fill("");

    for (const [oldIdx, newIdx] of matches) {
      newKeys[newIdx] = charKeys[oldIdx];
    }

    const entering = new Set<string>();
    for (let i = 0; i < newKeys.length; i++) {
      if (!newKeys[i]) {
        const key = `c${nextIdRef.current++}`;
        newKeys[i] = key;
        entering.add(key);
      }
    }

    enteringKeysRef.current = entering;
    setPrevText(children);
    setCharKeys(newKeys);
  }

  const base: Transition = transition ?? {
    duration: 0.35,
    ease: [0.19, 1, 0.22, 1],
  };

  return (
    <span className={className} style={{ display: "inline-flex", ...style }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {children.split("").map((char, i) => {
          const key = charKeys[i];
          const isEntering = enteringKeysRef.current.has(key);

          return (
            <motion.span
              key={key}
              layout={isEntering ? false : "position"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={base}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
}

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
          <FluidText
            style={{
              fontSize: sizes[sizeIndex],
              fontWeight: weights[weightIndex].value,
              justifyContent: justifyMap[align],
            }}
          >
            {currentWord}
          </FluidText>
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
