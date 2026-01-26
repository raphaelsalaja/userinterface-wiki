"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";

type WaveType = "sine" | "triangle" | "square" | "sawtooth";

const WAVES: { type: WaveType; label: string }[] = [
  { type: "sine", label: "Sine" },
  { type: "triangle", label: "Triangle" },
  { type: "square", label: "Square" },
  { type: "sawtooth", label: "Sawtooth" },
];

export function OscillatorDemo() {
  const [activeWave, setActiveWave] = useState<WaveType | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const playWave = (type: WaveType) => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    const ctx = new AudioContext();
    contextRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = 440;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    oscillatorRef.current = osc;
    gainRef.current = gain;

    osc.start();
    setActiveWave(type);

    setTimeout(() => {
      stopWave();
    }, 1500);
  };

  const stopWave = () => {
    if (gainRef.current && contextRef.current) {
      const ctx = contextRef.current;
      gainRef.current.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.1,
      );
    }
    setTimeout(() => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {}
        oscillatorRef.current = null;
      }
      setActiveWave(null);
    }, 100);
  };

  return (
    <div className={styles.container}>
      {WAVES.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          className={styles.wave}
          data-active={activeWave === type}
          onClick={() => (activeWave === type ? stopWave() : playWave(type))}
        >
          <WaveformSVG type={type} isActive={activeWave === type} />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function WaveformSVG({
  type,
  isActive,
}: {
  type: WaveType;
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
    }
  };

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 96 48"
      data-active={isActive}
      aria-label={`${type} waveform`}
      role="img"
    >
      <path d={getPath()} className={styles.path} />
    </svg>
  );
}
