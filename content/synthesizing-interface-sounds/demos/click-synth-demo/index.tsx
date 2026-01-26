"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface ClickParams {
  duration: number;
  frequency: number;
  q: number;
  decayRate: number;
  gain: number;
}

const PRESETS: { name: string; params: ClickParams }[] = [
  {
    name: "Soft Click",
    params: {
      duration: 0.006,
      frequency: 3000,
      q: 2,
      decayRate: 40,
      gain: 0.4,
    },
  },
  {
    name: "Sharp Tap",
    params: {
      duration: 0.008,
      frequency: 5000,
      q: 4,
      decayRate: 30,
      gain: 0.5,
    },
  },
  {
    name: "Mechanical",
    params: {
      duration: 0.012,
      frequency: 2000,
      q: 6,
      decayRate: 60,
      gain: 0.45,
    },
  },
  {
    name: "Muted",
    params: {
      duration: 0.015,
      frequency: 1200,
      q: 2,
      decayRate: 100,
      gain: 0.35,
    },
  },
];

export function ClickSynthDemo() {
  const [params, setParams] = useState<ClickParams>({
    duration: 0.008,
    frequency: 4000,
    q: 3,
    decayRate: 50,
    gain: 0.5,
  });

  const playClick = () => {
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    // Create noise buffer with built-in decay
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
    gain.gain.value = params.gain;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
  };

  const updateParam = <K extends keyof ClickParams>(
    key: K,
    value: ClickParams[K],
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: ClickParams) => {
    setParams(preset);
  };

  return (
    <div className={styles.container}>
      <div className={styles.presets}>
        {PRESETS.map(({ name, params: presetParams }) => (
          <button
            key={name}
            type="button"
            className={styles.presetButton}
            onClick={() => applyPreset(presetParams)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Duration
            <span className={styles.value}>
              {(params.duration * 1000).toFixed(0)}ms
            </span>
          </span>
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
        </label>

        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Frequency
            <span className={styles.value}>{params.frequency} Hz</span>
          </span>
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
        </label>

        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Resonance (Q)
            <span className={styles.value}>{params.q.toFixed(1)}</span>
          </span>
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
        </label>

        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Decay Rate
            <span className={styles.value}>{params.decayRate}</span>
          </span>
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
        </label>

        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Volume
            <span className={styles.value}>
              {Math.round(params.gain * 100)}%
            </span>
          </span>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={params.gain}
            onChange={(e) =>
              updateParam("gain", Number.parseFloat(e.target.value))
            }
            className={styles.range}
          />
        </label>
      </div>

      <button type="button" className={styles.playButton} onClick={playClick}>
        Play Click
      </button>

      <div className={styles.code}>
        <pre>{generateCode(params)}</pre>
      </div>
    </div>
  );
}

function generateCode(params: ClickParams): string {
  return `const ctx = new AudioContext();
const t = ctx.currentTime;

const buffer = ctx.createBuffer(1, ctx.sampleRate * ${params.duration}, ctx.sampleRate);
const data = buffer.getChannelData(0);

for (let i = 0; i < data.length; i++) {
  data[i] = (Math.random() * 2 - 1) * Math.exp(-i / ${params.decayRate});
}

const noise = ctx.createBufferSource();
noise.buffer = buffer;

const filter = ctx.createBiquadFilter();
filter.type = "bandpass";
filter.frequency.value = ${params.frequency};
filter.Q.value = ${params.q};

const gain = ctx.createGain();
gain.gain.value = ${params.gain};

noise.connect(filter);
filter.connect(gain);
gain.connect(ctx.destination);

noise.start(t);`;
}
