"use client";

import { Slider } from "@base-ui/react/slider";
import { FloatingPortal as Portal } from "@floating-ui/react";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { Button } from "@/components/button";
import { Menu } from "@/components/menu";
import { Orb } from "@/components/orb";
import { Shortcut } from "@/components/shortcut";
import {
  ArrowInboxIcon,
  Checkmark2SmallIcon,
  FastForwardIcon,
  GaugeIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
} from "@/icons";
import { sounds } from "@/lib/sounds";
import { formatTime } from "./functions";
import { useNarrationContext } from "./provider";
import styles from "./styles.module.css";
import type { PlaybackRate } from "./types";

const PLAYBACK_RATES: PlaybackRate[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

const ICON_SIZE = {
  large: 24,
  small: 18,
} as const;

const ICON_TRANSITION = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  transition: { duration: 0.15 },
} as const;

interface SettingsMenuProps {
  playbackRate: PlaybackRate;
  onPlaybackRateChange: (rate: PlaybackRate) => void;
}

function SettingsMenu(props: SettingsMenuProps) {
  return (
    <Menu.Root>
      <Shortcut shortcut={{ label: "Settings" }}>
        <Menu.Trigger
          render={
            <Button variant="ghost" aspect="square" className={styles.button}>
              <GaugeIcon size={ICON_SIZE.large} />
            </Button>
          }
        />
      </Shortcut>
      <Menu.Portal keepMounted>
        <Menu.Positioner sideOffset={16} align="end" side="top">
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Speed</Menu.GroupLabel>
              <Menu.RadioGroup value={props.playbackRate.toString()}>
                {PLAYBACK_RATES.map((rate) => (
                  <Menu.RadioItem
                    key={rate}
                    value={rate.toString()}
                    closeOnClick={false}
                    onClick={() => {
                      sounds.tick();
                      props.onPlaybackRateChange(rate);
                    }}
                  >
                    <span>{rate}</span>
                    <Menu.RadioItemIndicator
                      keepMounted
                      render={
                        <AnimatePresence initial={false}>
                          {props.playbackRate === rate && (
                            <motion.div
                              key={`playback-rate-${rate}`}
                              {...ICON_TRANSITION}
                            >
                              <Checkmark2SmallIcon size={18} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      }
                    />
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

interface PlayerProps {
  className?: string;
}

export function Player({ className }: PlayerProps) {
  const {
    slug,
    title,
    authorName,
    colors,
    status,
    isPlaying,
    isPlayerVisible,
    duration,
    currentTime,
    agentState,
    toggle,
    seek,
    skipForward,
    skipBackward,
    playbackRate,
    setPlaybackRate,
    download,
    audioUrl,
  } = useNarrationContext("Player");

  const progress =
    duration > 0
      ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
      : 0;

  const handleSeek = useCallback(
    (value: number | number[]) => {
      const percent = Array.isArray(value) ? value[0] : value;
      if (percent === undefined || duration <= 0) return;
      seek((percent / 100) * duration);
    },
    [duration, seek],
  );

  if (
    !slug ||
    status === "idle" ||
    status === "loading" ||
    status === "error"
  ) {
    return null;
  }

  return (
    <Portal>
      <motion.div
        className={clsx(styles.player, className)}
        initial={{
          opacity: 0,
        }}
        exit={{
          opacity: 0,
        }}
        inert={!isPlayerVisible ? true : undefined}
        animate={{
          filter: isPlayerVisible ? "none" : "blur(8px)",
          opacity: isPlayerVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className={styles.background} />
        <div className={styles["player-controls"]}>
          <div className={styles.details}>
            <div className={styles.cover}>
              <Orb
                colors={colors}
                agentState={agentState}
                className={clsx(styles.shader, {
                  [styles.talking]: agentState === "talking",
                })}
              />
            </div>
            <div className={styles.info}>
              <div className={styles["player-title"]}>{title}</div>
              <div className={styles.author}>{authorName}</div>
            </div>
          </div>
          <div className={styles.progress}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <Slider.Root
              value={progress}
              onValueChange={handleSeek}
              aria-label="Playback progress"
              className={styles.slider}
            >
              <Slider.Control className={styles.control}>
                <Slider.Track className={styles.track}>
                  <Slider.Indicator className={styles.indicator} />
                  <Slider.Thumb className={styles.thumb} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
          <div className={styles.controls}>
            <Shortcut shortcut={{ label: "Download" }}>
              <Button
                variant="ghost"
                className={styles.button}
                aspect="square"
                sound={false}
                onClick={() => {
                  sounds.confirm();
                  download();
                }}
                disabled={!audioUrl}
                aria-label="Download audio"
              >
                <ArrowInboxIcon size={ICON_SIZE.small} />
              </Button>
            </Shortcut>
            <div className={styles.options}>
              <Shortcut shortcut={{ label: "Rewind", command: "-15s" }}>
                <Button
                  variant="ghost"
                  aspect="square"
                  className={styles.button}
                  sound={false}
                  onClick={() => {
                    sounds.whoosh();
                    skipBackward();
                  }}
                  aria-label="Rewind 15 seconds"
                >
                  <RewindIcon size={ICON_SIZE.small} />
                </Button>
              </Shortcut>
              <Shortcut
                shortcut={{
                  label: isPlaying ? "Pause" : "Play",
                  command: "Space",
                }}
              >
                <Button
                  variant="ghost"
                  className={styles.button}
                  aspect="square"
                  sound={false}
                  onClick={() => {
                    sounds.toggle();
                    toggle();
                  }}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isPlaying ? (
                      <motion.div {...ICON_TRANSITION} key="pause">
                        <PauseIcon size={ICON_SIZE.large} />
                      </motion.div>
                    ) : (
                      <motion.div {...ICON_TRANSITION} key="play">
                        <PlayIcon size={ICON_SIZE.large} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </Shortcut>
              <Shortcut shortcut={{ label: "Fast Forward", command: "+15s" }}>
                <Button
                  variant="ghost"
                  aspect="square"
                  className={styles.button}
                  sound={false}
                  onClick={() => {
                    sounds.whoosh();
                    skipForward();
                  }}
                  aria-label="Fast forward 15 seconds"
                >
                  <FastForwardIcon size={ICON_SIZE.small} />
                </Button>
              </Shortcut>
            </div>
            <SettingsMenu
              playbackRate={playbackRate}
              onPlaybackRateChange={setPlaybackRate}
            />
          </div>
        </div>
      </motion.div>
    </Portal>
  );
}
