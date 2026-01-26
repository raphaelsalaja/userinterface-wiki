"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";

type WaveType = "sine" | "triangle" | "square" | "sawtooth";

const WAVE_TYPES: { type: WaveType; label: string; description: string }[] = [
  { type: "sine", label: "Sine", description: "Pure tone, no harmonics" },
  {
    type: "triangle",
    label: "Triangle",
    description: "Soft, mellow harmonics",
  },
  { type: "square", label: "Square", description: "Hollow, digital sound" },
  { type: "sawtooth", label: "Sawtooth", description: "Bright and buzzy" },
];

function getAudioContext(): AudioContext {
  return new AudioContext();
}

export function OscillatorDemo() {
  const [activeWave, setActiveWave] = useState<WaveType | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const playWave = (type: WaveType) => {
    // Stop any existing sound
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    const ctx = getAudioContext();
    contextRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = 440;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    oscillatorRef.current = osc;
    gainRef.current = gain;

    osc.start();
    setActiveWave(type);

    // Auto-stop after 2 seconds
    setTimeout(() => {
      stopWave();
    }, 2000);
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
      <div className={styles.waveforms}>
        {WAVE_TYPES.map(({ type, label, description }) => (
          <button
            key={type}
            type="button"
            className={styles.waveButton}
            data-active={activeWave === type}
            onClick={() => (activeWave === type ? stopWave() : playWave(type))}
          >
            <WaveformSVG type={type} isActive={activeWave === type} />
            <span className={styles.label}>{label}</span>
            <span className={styles.description}>{description}</span>
          </button>
        ))}
      </div>
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
        return "M 0 20 Q 10 0, 20 20 Q 30 40, 40 20 Q 50 0, 60 20 Q 70 40, 80 20";
      case "triangle":
        return "M 0 20 L 10 0 L 30 40 L 50 0 L 70 40 L 80 20";
      case "square":
        return "M 0 20 L 0 0 L 20 0 L 20 40 L 40 40 L 40 0 L 60 0 L 60 40 L 80 40 L 80 20";
      case "sawtooth":
        return "M 0 40 L 20 0 L 20 40 L 40 0 L 40 40 L 60 0 L 60 40 L 80 0";
    }
  };

  return (
    <svg
      className={styles.waveformSvg}
      viewBox="0 0 80 40"
      data-active={isActive}
      aria-label={`${type} waveform`}
      role="img"
    >
      <path
        d={getPath()}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
