"use client";

import { useState } from "react";
import styles from "./styles.module.css";

type FilterType = "none" | "lowpass" | "highpass" | "bandpass";

const FILTER_TYPES: { type: FilterType; label: string; freq: number }[] = [
  { type: "none", label: "Raw Noise", freq: 0 },
  { type: "lowpass", label: "Lowpass", freq: 1000 },
  { type: "highpass", label: "Highpass", freq: 2000 },
  { type: "bandpass", label: "Bandpass", freq: 3000 },
];

export function NoiseDemo() {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const playNoise = (filterType: FilterType) => {
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    // Create noise buffer
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
        FILTER_TYPES.find((f) => f.type === filterType)?.freq || 2000;
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
      <div className={styles.filters}>
        {FILTER_TYPES.map(({ type, label, freq }) => (
          <button
            key={type}
            type="button"
            className={styles.filterButton}
            data-active={activeFilter === type}
            onClick={() => playNoise(type)}
          >
            <FilterVisual type={type} isActive={activeFilter === type} />
            <span className={styles.label}>{label}</span>
            {freq > 0 && <span className={styles.freq}>{freq} Hz</span>}
          </button>
        ))}
      </div>
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
        // Random noise pattern
        return "M 0 20 L 5 12 L 10 28 L 15 8 L 20 32 L 25 15 L 30 25 L 35 10 L 40 30 L 45 18 L 50 22 L 55 14 L 60 26 L 65 16 L 70 24 L 75 12 L 80 20";
      case "lowpass":
        // Curve dropping off at high frequencies
        return "M 0 20 C 20 20, 40 20, 50 22 C 60 25, 70 32, 80 38";
      case "highpass":
        // Curve rising from low frequencies
        return "M 0 38 C 10 32, 20 25, 30 22 C 40 20, 60 20, 80 20";
      case "bandpass":
        // Bell curve
        return "M 0 35 C 15 30, 25 20, 40 18 C 55 20, 65 30, 80 35";
    }
  };

  return (
    <svg
      className={styles.filterSvg}
      viewBox="0 0 80 40"
      data-active={isActive}
      aria-label={`${type} filter visualization`}
      role="img"
    >
      <path d={getPath()} fill="none" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
