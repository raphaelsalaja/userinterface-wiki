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
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = () => {
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

  const applyPreset = (params: EnvelopeParams) => {
    setAttack(params.attack);
    setDecay(params.decay);
  };

  // Calculate path for envelope visualization
  const getEnvelopePath = () => {
    const totalTime = attack + decay;
    const attackX = (attack / totalTime) * 200;
    return `M 0 80 L ${attackX} 10 Q ${attackX + 20} 15, ${attackX + 40} 30 Q ${100 + attackX} 60, 200 80`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.visualization}>
        <svg
          className={styles.envelopeSvg}
          viewBox="0 0 200 90"
          data-playing={isPlaying}
          aria-label="Envelope visualization showing attack and decay"
          role="img"
        >
          <path d={getEnvelopePath()} fill="none" strokeWidth="2" />
          <text x="0" y="88" className={styles.label}>
            0
          </text>
          <text x="190" y="88" className={styles.label}>
            {(attack + decay).toFixed(2)}s
          </text>
        </svg>
      </div>

      <div className={styles.controls}>
        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Attack
            <span className={styles.value}>{(attack * 1000).toFixed(0)}ms</span>
          </span>
          <input
            type="range"
            min="0.001"
            max="0.3"
            step="0.001"
            value={attack}
            onChange={(e) => setAttack(Number.parseFloat(e.target.value))}
            className={styles.range}
          />
        </label>

        <label className={styles.slider}>
          <span className={styles.sliderLabel}>
            Decay
            <span className={styles.value}>{(decay * 1000).toFixed(0)}ms</span>
          </span>
          <input
            type="range"
            min="0.02"
            max="0.8"
            step="0.01"
            value={decay}
            onChange={(e) => setDecay(Number.parseFloat(e.target.value))}
            className={styles.range}
          />
        </label>
      </div>

      <div className={styles.presets}>
        {PRESETS.map(({ name, params }) => (
          <button
            key={name}
            type="button"
            className={styles.presetButton}
            onClick={() => applyPreset(params)}
          >
            {name}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.playButton}
        onClick={playSound}
        data-playing={isPlaying}
      >
        {isPlaying ? "Playing..." : "Play Sound"}
      </button>
    </div>
  );
}
