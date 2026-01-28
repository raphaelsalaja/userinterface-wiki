"use client";

import { useRef, useState } from "react";
import {
  playClick,
  playDrop,
  playError,
  playPop,
  playStartup,
  playSuccess,
  playTick,
  playToggle,
  playWarning,
} from "./sounds";
import styles from "./styles.module.css";

type SoundType =
  | "click"
  | "pop"
  | "toggle"
  | "tick"
  | "drop"
  | "success"
  | "error"
  | "warning"
  | "startup";

type FeelType =
  | "soft"
  | "aero"
  | "arcade"
  | "organic"
  | "glass"
  | "industrial"
  | "minimal"
  | "retro"
  | "crisp";

const SOUND_CONFIG: Record<SoundType, { label: string; color: string }> = {
  click: { label: "Click", color: "purple" },
  pop: { label: "Pop", color: "pink" },
  toggle: { label: "Toggle", color: "blue" },
  tick: { label: "Tick", color: "cyan" },
  drop: { label: "Drop", color: "teal" },
  success: { label: "Success", color: "green" },
  error: { label: "Error", color: "red" },
  warning: { label: "Warning", color: "orange" },
  startup: { label: "Startup", color: "yellow" },
};

const FEEL_LABELS: Record<FeelType, { label: string; description: string }> = {
  soft: { label: "Soft", description: "Gentle, muted" },
  aero: { label: "Aero", description: "Clean, modern" },
  arcade: { label: "Arcade", description: "Retro, playful" },
  organic: { label: "Organic", description: "Warm, natural" },
  glass: { label: "Glass", description: "Crystalline, bright" },
  industrial: { label: "Industrial", description: "Harsh, metallic" },
  minimal: { label: "Minimal", description: "Subtle, quiet" },
  retro: { label: "Retro", description: "Lo-fi, muffled" },
  crisp: { label: "Crisp", description: "Clean, precise" },
};

// Feel modifiers for each sound type
const FEEL_PARAMS: Record<
  FeelType,
  {
    filterFreq: number;
    q: number;
    oscType: OscillatorType;
    decayMult: number;
    gainMult: number;
    pitchMult: number;
  }
> = {
  soft: {
    filterFreq: 2000,
    q: 1,
    oscType: "sine",
    decayMult: 1.5,
    gainMult: 0.7,
    pitchMult: 0.8,
  },
  aero: {
    filterFreq: 3500,
    q: 2,
    oscType: "sine",
    decayMult: 1.0,
    gainMult: 0.9,
    pitchMult: 1.0,
  },
  arcade: {
    filterFreq: 4000,
    q: 8,
    oscType: "square",
    decayMult: 0.5,
    gainMult: 1.0,
    pitchMult: 1.5,
  },
  organic: {
    filterFreq: 2500,
    q: 3,
    oscType: "triangle",
    decayMult: 1.3,
    gainMult: 0.85,
    pitchMult: 0.9,
  },
  glass: {
    filterFreq: 6000,
    q: 10,
    oscType: "sine",
    decayMult: 1.2,
    gainMult: 0.75,
    pitchMult: 1.8,
  },
  industrial: {
    filterFreq: 3000,
    q: 12,
    oscType: "sawtooth",
    decayMult: 0.6,
    gainMult: 1.2,
    pitchMult: 0.7,
  },
  minimal: {
    filterFreq: 2000,
    q: 1,
    oscType: "sine",
    decayMult: 0.8,
    gainMult: 0.4,
    pitchMult: 1.0,
  },
  retro: {
    filterFreq: 1500,
    q: 2,
    oscType: "square",
    decayMult: 1.1,
    gainMult: 0.8,
    pitchMult: 0.85,
  },
  crisp: {
    filterFreq: 5500,
    q: 4,
    oscType: "triangle",
    decayMult: 0.6,
    gainMult: 1.0,
    pitchMult: 1.1,
  },
};

export function SoundLabDemo() {
  const [feel, setFeel] = useState<FeelType>("aero");
  const [playingSound, setPlayingSound] = useState<SoundType | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = () => {
    ctxRef.current?.close();
    ctxRef.current = new AudioContext();
    return ctxRef.current;
  };

  const playSound = (sound: SoundType) => {
    const ctx = getContext();
    const t = ctx.currentTime;
    const params = FEEL_PARAMS[feel];

    setPlayingSound(sound);

    switch (sound) {
      case "click":
        playClick(ctx, t, params);
        break;
      case "pop":
        playPop(ctx, t, params);
        break;
      case "toggle":
        playToggle(ctx, t, params);
        break;
      case "tick":
        playTick(ctx, t, params);
        break;
      case "drop":
        playDrop(ctx, t, params);
        break;
      case "success":
        playSuccess(ctx, t, params);
        break;
      case "error":
        playError(ctx, t, params);
        break;
      case "warning":
        playWarning(ctx, t, params);
        break;
      case "startup":
        playStartup(ctx, t, params);
        break;
    }

    const duration =
      sound === "startup" ? 700 : sound === "success" ? 400 : 200;
    setTimeout(() => setPlayingSound(null), duration);
  };

  const handleFeelChange = (newFeel: FeelType) => {
    setFeel(newFeel);
    const ctx = getContext();
    const t = ctx.currentTime;
    const params = FEEL_PARAMS[newFeel];
    playToggle(ctx, t, params);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pads}>
        {(Object.keys(SOUND_CONFIG) as SoundType[]).map((sound) => (
          <button
            key={sound}
            type="button"
            className={styles.pad}
            data-color={SOUND_CONFIG[sound].color}
            data-playing={playingSound === sound}
            onClick={() => playSound(sound)}
          >
            {SOUND_CONFIG[sound].label}
          </button>
        ))}
      </div>

      <div className={styles.feels}>
        {(Object.keys(FEEL_LABELS) as FeelType[]).map((f) => (
          <button
            key={f}
            type="button"
            className={styles.feelButton}
            data-active={feel === f}
            onClick={() => handleFeelChange(f)}
          >
            {FEEL_LABELS[f].label}
          </button>
        ))}
      </div>
    </div>
  );
}
