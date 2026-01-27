"use client";

import { useState } from "react";
import styles from "./styles.module.css";

type SoundType =
  | "click"
  | "pop"
  | "toggle"
  | "tick"
  | "whoosh"
  | "success"
  | "error"
  | "warning"
  | "startup";

type FeelType =
  | "mechanical"
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
  whoosh: { label: "Whoosh", color: "teal" },
  success: { label: "Success", color: "green" },
  error: { label: "Error", color: "red" },
  warning: { label: "Warning", color: "orange" },
  startup: { label: "Startup", color: "yellow" },
};

const FEEL_LABELS: Record<FeelType, { label: string; description: string }> = {
  mechanical: { label: "Mechanical", description: "Sharp, precise" },
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
  mechanical: {
    filterFreq: 5000,
    q: 6,
    oscType: "square",
    decayMult: 0.7,
    gainMult: 1.1,
    pitchMult: 1.2,
  },
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

  const playSound = (sound: SoundType) => {
    const ctx = new AudioContext();
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
      case "whoosh":
        playWhoosh(ctx, t, params);
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

  const feels = Object.keys(FEEL_LABELS) as FeelType[];
  const currentIndex = feels.indexOf(feel);

  const prevFeel = () => {
    const newIndex = currentIndex === 0 ? feels.length - 1 : currentIndex - 1;
    setFeel(feels[newIndex]);
  };

  const nextFeel = () => {
    const newIndex = currentIndex === feels.length - 1 ? 0 : currentIndex + 1;
    setFeel(feels[newIndex]);
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

      <div className={styles.feelSelector}>
        <button
          type="button"
          className={styles.feelArrow}
          onClick={prevFeel}
          aria-label="Previous feel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className={styles.feelLabel}>{FEEL_LABELS[feel].label}</span>
        <button
          type="button"
          className={styles.feelArrow}
          onClick={nextFeel}
          aria-label="Next feel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Sound implementations
function playClick(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const duration = 0.008 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (50 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = params.filterFreq;
  filter.Q.value = params.q;

  const gain = ctx.createGain();
  gain.gain.value = 0.5 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

function playPop(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = params.oscType;
  osc.frequency.setValueAtTime(400 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.04 * params.decayMult);

  gain.gain.setValueAtTime(0.35 * params.gainMult, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 * params.decayMult);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05 * params.decayMult);
}

function playToggle(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  // Noise layer
  const duration = 0.012 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (80 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2500;
  filter.Q.value = params.q;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.4 * params.gainMult;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(t);

  // Tone layer
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = params.oscType;
  osc.frequency.setValueAtTime(800 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.03 * params.decayMult);

  oscGain.gain.setValueAtTime(0.15 * params.gainMult, t);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04 * params.decayMult);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.04 * params.decayMult);
}

function playTick(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const duration = 0.004 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (20 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000 * params.pitchMult;

  const gain = ctx.createGain();
  gain.gain.value = 0.3 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

function playWhoosh(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const duration = 0.08 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const env = Math.sin((i / data.length) * Math.PI);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(4000 * params.pitchMult, t);
  filter.frequency.exponentialRampToValueAtTime(1500, t + duration);
  filter.Q.value = 1;

  const gain = ctx.createGain();
  gain.gain.value = 0.15 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

function playSuccess(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const notes = [523.25, 659.25, 783.99].map((n) => n * params.pitchMult);
  const spacing = 0.08 * params.decayMult;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = params.oscType === "square" ? "triangle" : params.oscType;
    osc.frequency.value = freq;

    const start = t + i * spacing;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25 * params.gainMult, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      start + 0.15 * params.decayMult,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.15 * params.decayMult);
  });
}

function playError(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  const baseFreq = 180 * params.pitchMult;
  osc1.type = params.oscType === "sine" ? "sawtooth" : params.oscType;
  osc1.frequency.setValueAtTime(baseFreq, t);
  osc1.frequency.exponentialRampToValueAtTime(80, t + 0.25 * params.decayMult);

  osc2.type = params.oscType === "sine" ? "square" : params.oscType;
  osc2.frequency.setValueAtTime(baseFreq * 1.05, t);
  osc2.frequency.exponentialRampToValueAtTime(85, t + 0.25 * params.decayMult);

  gain.gain.setValueAtTime(0.2 * params.gainMult, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25 * params.decayMult);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(filter);
  filter.connect(ctx.destination);

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.25 * params.decayMult);
  osc2.stop(t + 0.25 * params.decayMult);
}

function playWarning(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  [0, 0.15 * params.decayMult].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = params.oscType === "square" ? "triangle" : params.oscType;
    osc.frequency.value = (i === 0 ? 880 : 698) * params.pitchMult;

    const start = t + delay;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.3 * params.gainMult, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      start + 0.12 * params.decayMult,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.12 * params.decayMult);
  });
}

function playStartup(
  ctx: AudioContext,
  t: number,
  params: typeof FEEL_PARAMS.mechanical,
) {
  const chordNotes = [392, 493.88, 587.33, 784].map(
    (n) => n * params.pitchMult,
  );
  const delays = [0, 0.02, 0.04, 0.06].map((d) => d * params.decayMult);

  chordNotes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = params.oscType === "square" ? "triangle" : params.oscType;
    osc.frequency.value = freq;
    osc2.type = osc.type;
    osc2.frequency.value = freq * 1.002;

    filter.type = "lowpass";
    filter.frequency.value = 2000;

    const start = t + delays[i];
    const duration = 0.6 * params.decayMult - delays[i];

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.14 * params.gainMult, start + 0.05);
    gain.gain.setValueAtTime(0.14 * params.gainMult, start + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc2.start(start);
    osc.stop(start + duration);
    osc2.stop(start + duration);
  });
}
