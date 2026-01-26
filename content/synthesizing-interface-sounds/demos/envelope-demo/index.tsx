"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface EnvelopeParams {
  attack: number;
  decay: number;
}

const PRESETS: { name: string; params: EnvelopeParams }[] = [
  { name: "Click", params: { attack: 0.001, decay: 0.05 } },
  { name: "Tap", params: { attack: 0.005, decay: 0.1 } },
  { name: "Pluck", params: { attack: 0.01, decay: 0.3 } },
  { name: "Swell", params: { attack: 0.15, decay: 0.4 } },
];

export function EnvelopeDemo() {
  const [attack, setAttack] = useState(0.01);
  const [decay, setDecay] = useState(0.15);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = () => {
    if (isPlaying) return;

    const ctx = new AudioContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = 440;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    setIsPlaying(true);
    osc.start(t);
    osc.stop(t + attack + decay + 0.01);

    setTimeout(
      () => {
        setIsPlaying(false);
      },
      (attack + decay) * 1000,
    );
  };

  const applyPreset = (name: string, params: EnvelopeParams) => {
    setAttack(params.attack);
    setDecay(params.decay);
    setActivePreset(name);
  };

  const handleSliderChange = (type: "attack" | "decay", value: number) => {
    if (type === "attack") {
      setAttack(value);
    } else {
      setDecay(value);
    }
    setActivePreset(null);
  };

  const getEnvelopePath = () => {
    const width = 240;
    const height = 80;
    const totalTime = attack + decay;
    const attackX = (attack / totalTime) * width;

    return `M 0 ${height} L ${attackX} 8 Q ${attackX + 15} 12, ${attackX + 30} 24 Q ${width * 0.7} ${height * 0.6}, ${width} ${height}`;
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.visualization}
        onClick={playSound}
        data-playing={isPlaying}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 240 80"
          aria-label="Envelope visualization"
          role="img"
        >
          <path d={getEnvelopePath()} className={styles.path} />
        </svg>
        <span className={styles.hint}>
          {isPlaying ? "playing" : "click to play"}
        </span>
      </button>

      <div className={styles.controls}>
        <div className={styles.sliders}>
          <label className={styles.slider}>
            <span className={styles.label}>Attack</span>
            <input
              type="range"
              min="0.001"
              max="0.3"
              step="0.001"
              value={attack}
              onChange={(e) =>
                handleSliderChange("attack", Number.parseFloat(e.target.value))
              }
              className={styles.range}
            />
            <span className={styles.value}>{(attack * 1000).toFixed(0)}ms</span>
          </label>

          <label className={styles.slider}>
            <span className={styles.label}>Decay</span>
            <input
              type="range"
              min="0.02"
              max="0.8"
              step="0.01"
              value={decay}
              onChange={(e) =>
                handleSliderChange("decay", Number.parseFloat(e.target.value))
              }
              className={styles.range}
            />
            <span className={styles.value}>{(decay * 1000).toFixed(0)}ms</span>
          </label>
        </div>

        <div className={styles.presets}>
          {PRESETS.map(({ name, params }) => (
            <button
              key={name}
              type="button"
              className={styles.preset}
              data-active={activePreset === name}
              onClick={() => applyPreset(name, params)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
