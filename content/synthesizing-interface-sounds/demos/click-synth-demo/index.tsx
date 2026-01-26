"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface ClickParams {
  duration: number;
  frequency: number;
  q: number;
  decayRate: number;
}

const PRESETS: { name: string; params: ClickParams }[] = [
  {
    name: "Soft",
    params: { duration: 0.006, frequency: 3000, q: 2, decayRate: 40 },
  },
  {
    name: "Sharp",
    params: { duration: 0.008, frequency: 5000, q: 4, decayRate: 30 },
  },
  {
    name: "Mechanical",
    params: { duration: 0.012, frequency: 2000, q: 6, decayRate: 60 },
  },
  {
    name: "Muted",
    params: { duration: 0.015, frequency: 1200, q: 2, decayRate: 100 },
  },
];

export function ClickSynthDemo() {
  const [params, setParams] = useState<ClickParams>({
    duration: 0.008,
    frequency: 4000,
    q: 3,
    decayRate: 50,
  });
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playClick = () => {
    if (isPlaying) return;

    const ctx = new AudioContext();
    const t = ctx.currentTime;

    const samples = Math.floor(ctx.sampleRate * params.duration);
    const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / params.decayRate);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = params.frequency;
    filter.Q.value = params.q;

    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    setIsPlaying(true);
    noise.start(t);

    setTimeout(() => setIsPlaying(false), 150);
  };

  const applyPreset = (name: string, preset: ClickParams) => {
    setParams(preset);
    setActivePreset(name);
  };

  const updateParam = <K extends keyof ClickParams>(
    key: K,
    value: ClickParams[K],
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.playArea}
        onClick={playClick}
        data-playing={isPlaying}
      >
        <span className={styles.playLabel}>click</span>
        <span className={styles.hint}>{isPlaying ? "·" : "tap to hear"}</span>
      </button>

      <div className={styles.controls}>
        <div className={styles.presets}>
          {PRESETS.map(({ name, params: preset }) => (
            <button
              key={name}
              type="button"
              className={styles.preset}
              data-active={activePreset === name}
              onClick={() => applyPreset(name, preset)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className={styles.sliders}>
          <label className={styles.slider}>
            <span className={styles.label}>Duration</span>
            <input
              type="range"
              min="0.002"
              max="0.02"
              step="0.001"
              value={params.duration}
              onChange={(e) =>
                updateParam("duration", Number.parseFloat(e.target.value))
              }
              className={styles.range}
            />
            <span className={styles.value}>
              {(params.duration * 1000).toFixed(0)}ms
            </span>
          </label>

          <label className={styles.slider}>
            <span className={styles.label}>Frequency</span>
            <input
              type="range"
              min="1000"
              max="8000"
              step="100"
              value={params.frequency}
              onChange={(e) =>
                updateParam("frequency", Number.parseInt(e.target.value, 10))
              }
              className={styles.range}
            />
            <span className={styles.value}>{params.frequency}Hz</span>
          </label>

          <label className={styles.slider}>
            <span className={styles.label}>Resonance</span>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={params.q}
              onChange={(e) =>
                updateParam("q", Number.parseFloat(e.target.value))
              }
              className={styles.range}
            />
            <span className={styles.value}>{params.q.toFixed(1)}</span>
          </label>

          <label className={styles.slider}>
            <span className={styles.label}>Decay</span>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={params.decayRate}
              onChange={(e) =>
                updateParam("decayRate", Number.parseInt(e.target.value, 10))
              }
              className={styles.range}
            />
            <span className={styles.value}>{params.decayRate}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
