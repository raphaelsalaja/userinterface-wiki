"use client";

import { useState } from "react";
import styles from "./styles.module.css";

type FilterType = "none" | "lowpass" | "highpass" | "bandpass";

const FILTERS: { type: FilterType; label: string; freq: number }[] = [
  { type: "none", label: "Raw", freq: 0 },
  { type: "lowpass", label: "Lowpass", freq: 1000 },
  { type: "highpass", label: "Highpass", freq: 2000 },
  { type: "bandpass", label: "Bandpass", freq: 3000 },
];

export function NoiseDemo() {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const playNoise = (filterType: FilterType) => {
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    const duration = 0.3;
    const buffer = ctx.createBuffer(
      1,
      ctx.sampleRate * duration,
      ctx.sampleRate,
    );
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.setValueAtTime(0.3, t + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    if (filterType === "none") {
      noise.connect(gain);
    } else {
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value =
        FILTERS.find((f) => f.type === filterType)?.freq || 2000;
      filter.Q.value = filterType === "bandpass" ? 4 : 1;

      noise.connect(filter);
      filter.connect(gain);
    }

    gain.connect(ctx.destination);

    setActiveFilter(filterType);
    noise.start(t);

    setTimeout(() => {
      setActiveFilter(null);
    }, duration * 1000);
  };

  return (
    <div className={styles.container}>
      {FILTERS.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          className={styles.filter}
          data-active={activeFilter === type}
          onClick={() => playNoise(type)}
        >
          <FilterVisual type={type} isActive={activeFilter === type} />
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function FilterVisual({
  type,
  isActive,
}: {
  type: FilterType;
  isActive: boolean;
}) {
  const getPath = () => {
    switch (type) {
      case "none":
        return "M 0 24 L 6 14 L 12 32 L 18 10 L 24 36 L 30 18 L 36 28 L 42 12 L 48 34 L 54 20 L 60 26 L 66 16 L 72 30 L 78 19 L 84 27 L 90 15 L 96 24";
      case "lowpass":
        return "M 0 24 C 24 24, 48 24, 60 26 C 72 30, 84 38, 96 44";
      case "highpass":
        return "M 0 44 C 12 38, 24 30, 36 26 C 48 24, 72 24, 96 24";
      case "bandpass":
        return "M 0 40 C 18 36, 30 24, 48 22 C 66 24, 78 36, 96 40";
    }
  };

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 96 48"
      aria-label={`${type} filter`}
      role="img"
      data-active={isActive}
    >
      <path d={getPath()} className={styles.path} />
    </svg>
  );
}
