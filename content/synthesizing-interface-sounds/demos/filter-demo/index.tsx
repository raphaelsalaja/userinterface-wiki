"use client";

import { useState } from "react";
import styles from "./styles.module.css";

type FilterType = "lowpass" | "highpass" | "bandpass";

export function FilterDemo() {
  const [filterType, setFilterType] = useState<FilterType>("bandpass");
  const [frequency, setFrequency] = useState(2000);
  const [q, setQ] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);

  const playFilteredNoise = () => {
    if (isPlaying) return;

    const ctx = new AudioContext();
    const t = ctx.currentTime;

    const duration = 0.4;
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

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
    gain.gain.setValueAtTime(0.4, t + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    setIsPlaying(true);
    noise.start(t);

    setTimeout(() => {
      setIsPlaying(false);
    }, duration * 1000);
  };

  const getResponsePath = () => {
    const centerX =
      ((Math.log10(frequency) - Math.log10(200)) /
        (Math.log10(8000) - Math.log10(200))) *
      240;
    const width = 50 / q;

    switch (filterType) {
      case "lowpass":
        return `M 0 20 L ${Math.max(0, centerX - width)} 20 Q ${centerX} 24, ${centerX + width} 50 L 240 70`;
      case "highpass":
        return `M 0 70 L ${centerX - width} 50 Q ${centerX} 24, ${Math.min(240, centerX + width)} 20 L 240 20`;
      case "bandpass":
        return `M 0 65 Q ${centerX - width * 2} 50, ${centerX} 20 Q ${centerX + width * 2} 50, 240 65`;
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.visualization}
        onClick={playFilteredNoise}
        data-playing={isPlaying}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 240 80"
          aria-label={`${filterType} filter response`}
          role="img"
        >
          <path d={getResponsePath()} className={styles.path} />
          <line x1="0" y1="75" x2="240" y2="75" className={styles.axis} />
        </svg>
        <span className={styles.hint}>
          {isPlaying ? "playing" : "click to play"}
        </span>
      </button>

      <div className={styles.controls}>
        <div className={styles.types}>
          {(["lowpass", "highpass", "bandpass"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={styles.type}
              data-active={filterType === type}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className={styles.sliders}>
          <label className={styles.slider}>
            <span className={styles.label}>Freq</span>
            <input
              type="range"
              min="200"
              max="8000"
              step="100"
              value={frequency}
              onChange={(e) =>
                setFrequency(Number.parseInt(e.target.value, 10))
              }
              className={styles.range}
            />
            <span className={styles.value}>{frequency}Hz</span>
          </label>

          <label className={styles.slider}>
            <span className={styles.label}>Q</span>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={q}
              onChange={(e) => setQ(Number.parseFloat(e.target.value))}
              className={styles.range}
            />
            <span className={styles.value}>{q.toFixed(1)}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
