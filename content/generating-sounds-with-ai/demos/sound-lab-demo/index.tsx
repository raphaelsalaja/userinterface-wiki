"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentType } from "react";
import { useCallback, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { ArrowDownIcon } from "@/icons/arrows/arrow-down";
import { ArrowsRepeatIcon } from "@/icons/arrows/arrows-repeat";
import { CursorClickIcon } from "@/icons/arrows/cursor-click";
import { Checkmark1Icon } from "@/icons/interface-general/checkmark-1";
import { CircleCheckIcon } from "@/icons/interface-general/circle-check";
import { CircleDashedIcon } from "@/icons/interface-general/circle-dashed";
import { CirclePlaceholderOnIcon } from "@/icons/interface-general/circle-placeholder-on";
import { CircleXIcon } from "@/icons/interface-general/circle-x";
import { ExclamationTriangleIcon } from "@/icons/interface-general/exclamation-triangle";
import { FeatureIcon } from "@/icons/interface-general/feature";
import { GaugeIcon } from "@/icons/interface-general/gauge";
import { HeartIcon } from "@/icons/interface-general/heart";
import { MinusSmallIcon } from "@/icons/interface-general/minus-small";
import { StarIcon } from "@/icons/interface-general/star";
import { TargetIcon } from "@/icons/interface-general/target";
import { PlayIcon } from "@/icons/sound-and-music/play";
import { RecordIcon } from "@/icons/sound-and-music/record";
import { SoundFxIcon } from "@/icons/sound-and-music/sound-fx";
import type { IconProps } from "@/icons/types";
import {
  playClick,
  playDrop,
  playError,
  playPop,
  playStartup,
  playSuccess,
  playTick,
  playToggle,
  playWarning,
} from "./sounds";
import styles from "./styles.module.css";

type SoundType =
  | "click"
  | "pop"
  | "toggle"
  | "tick"
  | "drop"
  | "success"
  | "error"
  | "warning"
  | "startup";

type FeelType =
  | "soft"
  | "aero"
  | "arcade"
  | "organic"
  | "glass"
  | "industrial"
  | "minimal"
  | "retro"
  | "crisp";

const SOUND_TYPES: SoundType[] = [
  "click",
  "pop",
  "toggle",
  "tick",
  "drop",
  "success",
  "error",
  "warning",
  "startup",
];

type FeelParams = {
  filterFreq: number;
  q: number;
  oscType: OscillatorType;
  decayMult: number;
  gainMult: number;
  pitchMult: number;
};

type PlayFn = (ctx: AudioContext, t: number, params: FeelParams) => void;

const SOUND_CONFIG: Record<
  SoundType,
  { label: string; icon: ComponentType<IconProps>; play: PlayFn }
> = {
  click: { label: "Click", icon: CursorClickIcon, play: playClick },
  pop: { label: "Pop", icon: CirclePlaceholderOnIcon, play: playPop },
  toggle: { label: "Toggle", icon: ArrowsRepeatIcon, play: playToggle },
  tick: { label: "Tick", icon: Checkmark1Icon, play: playTick },
  drop: { label: "Drop", icon: ArrowDownIcon, play: playDrop },
  success: { label: "Success", icon: CircleCheckIcon, play: playSuccess },
  error: { label: "Error", icon: CircleXIcon, play: playError },
  warning: {
    label: "Warning",
    icon: ExclamationTriangleIcon,
    play: playWarning,
  },
  startup: { label: "Startup", icon: PlayIcon, play: playStartup },
};

const FEEL_TYPES: FeelType[] = [
  "soft",
  "aero",
  "arcade",
  "organic",
  "glass",
  "industrial",
  "minimal",
  "retro",
  "crisp",
];

const FEEL_CONFIG: Record<
  FeelType,
  { label: string; icon: ComponentType<IconProps>; color: string }
> = {
  soft: { label: "Soft", icon: HeartIcon, color: "pink" },
  aero: { label: "Aero", icon: FeatureIcon, color: "blue" },
  arcade: { label: "Arcade", icon: SoundFxIcon, color: "purple" },
  organic: { label: "Organic", icon: CircleDashedIcon, color: "green" },
  glass: { label: "Glass", icon: StarIcon, color: "cyan" },
  industrial: { label: "Industrial", icon: GaugeIcon, color: "orange" },
  minimal: { label: "Minimal", icon: MinusSmallIcon, color: "gray" },
  retro: { label: "Retro", icon: RecordIcon, color: "amber" },
  crisp: { label: "Crisp", icon: TargetIcon, color: "red" },
};

const FEEL_PARAMS: Record<FeelType, FeelParams> = {
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

const ICON_ANIMATION = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
};

const DOT_ANIMATION = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const LABEL_ANIMATION = {
  initial: { opacity: 0, filter: "blur(1px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(1px)" },
};

const FADE_TRANSITION = { duration: 0.15 };
const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;
const WIDTH_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export function SoundLabDemo() {
  const [feel, setFeel] = useState<FeelType>("aero");
  const [selectedSounds, setSelectedSounds] = useState<Set<SoundType>>(
    () => new Set(["click", "pop", "success", "error"]),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const [ref, bounds] = useMeasure();

  const sequence = SOUND_TYPES.filter((sound) => selectedSounds.has(sound));
  const safeIndex = sequence.length > 0 ? currentIndex % sequence.length : 0;
  const currentSound = sequence[safeIndex] ?? "click";

  const getContext = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playSoundEffect = useCallback(
    (sound: SoundType, feelOverride?: FeelType) => {
      const ctx = getContext();
      const params = FEEL_PARAMS[feelOverride ?? feel];
      SOUND_CONFIG[sound].play(ctx, ctx.currentTime, params);
    },
    [feel, getContext],
  );

  const toggleSound = useCallback((sound: SoundType) => {
    setSelectedSounds((prev) => {
      const next = new Set(prev);
      if (next.has(sound)) {
        next.delete(sound);
      } else {
        next.add(sound);
      }
      return next;
    });
  }, []);

  const cycleAndPlay = useCallback(() => {
    if (sequence.length === 0) return;
    playSoundEffect(currentSound);
    setCurrentIndex((prev) => prev + 1);
  }, [sequence.length, currentSound, playSoundEffect]);

  const handleFeelChange = useCallback(
    (newFeel: FeelType) => {
      setFeel(newFeel);
      playSoundEffect("toggle", newFeel);
    },
    [playSoundEffect],
  );

  const CurrentIcon = SOUND_CONFIG[currentSound].icon;
  const currentColor = FEEL_CONFIG[feel].color;

  const currentIconLabel = SOUND_CONFIG[currentSound].label;
  const currentFeelLabel = FEEL_CONFIG[feel].label;

  return (
    <div className={styles.root} data-color={currentColor}>
      <button
        type="button"
        className={styles.preview}
        onClick={cycleAndPlay}
        aria-label="Play next sound in sequence"
      >
        <div className={styles["preview-icon"]}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSound}
              initial={ICON_ANIMATION.initial}
              animate={ICON_ANIMATION.animate}
              exit={ICON_ANIMATION.exit}
              transition={FADE_TRANSITION}
            >
              <CurrentIcon size={24} />
            </motion.div>
          </AnimatePresence>
        </div>
      </button>

      <motion.div
        className={styles["dots-container"]}
        animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
        transition={WIDTH_TRANSITION}
      >
        <div className={styles.dots} ref={ref}>
          <AnimatePresence mode="popLayout">
            {sequence.map((sound, index) => (
              <motion.span
                key={sound}
                layout
                className={styles.dot}
                data-active={index === safeIndex}
                initial={DOT_ANIMATION.initial}
                animate={DOT_ANIMATION.animate}
                exit={DOT_ANIMATION.exit}
                transition={SPRING_TRANSITION}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className={styles.options}>
        <div className={styles.grid}>
          {SOUND_TYPES.map((sound) => {
            const { label, icon: Icon } = SOUND_CONFIG[sound];
            return (
              <button
                key={sound}
                type="button"
                className={styles["icon-button"]}
                data-active={selectedSounds.has(sound)}
                onClick={() => toggleSound(sound)}
                aria-label={label}
                aria-pressed={selectedSounds.has(sound)}
              >
                <Icon size={16} />
              </button>
            );
          })}

          <motion.div
            className={styles.current}
            key={currentIconLabel}
            initial={LABEL_ANIMATION.initial}
            animate={LABEL_ANIMATION.animate}
            exit={LABEL_ANIMATION.exit}
            transition={FADE_TRANSITION}
          >
            {currentIconLabel}
          </motion.div>
        </div>

        <div className={styles.divider} />

        <div className={styles.grid}>
          {FEEL_TYPES.map((f) => {
            const { label, icon: Icon } = FEEL_CONFIG[f];
            return (
              <button
                key={f}
                type="button"
                className={styles["icon-button"]}
                data-active={feel === f}
                onClick={() => handleFeelChange(f)}
                aria-label={label}
              >
                <Icon size={16} />
              </button>
            );
          })}

          <motion.div
            className={styles.current}
            key={currentFeelLabel}
            initial={LABEL_ANIMATION.initial}
            animate={LABEL_ANIMATION.animate}
            exit={LABEL_ANIMATION.exit}
            transition={FADE_TRANSITION}
          >
            {currentFeelLabel}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
