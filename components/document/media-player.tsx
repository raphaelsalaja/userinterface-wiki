"use client";

import { Menu } from "@base-ui/react/menu";
import { Slider } from "@base-ui/react/slider";
import { FloatingPortal as Portal } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { Button } from "@/components/button";
import { Shortcut } from "@/components/shortcut";
import {
  Checkmark1Icon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  VoiceSettingsIcon,
  VolumeFullIcon,
  VolumeHalfIcon,
  VolumeOffIcon,
} from "@/icons";
import { Orb } from "../orb";
import { ICON_SIZE, ICON_TRANSITION, PLAYBACK_RATES } from "./constants";
import { useDocumentContext } from "./context";
import styles from "./styles.module.css";
import type { PlaybackRate } from "./types";
import { formatTime } from "./utils";

// ─────────────────────────────────────────────────────────────────────────────
// PlayerBackground
// ─────────────────────────────────────────────────────────────────────────────

function PlayerBackground() {
  return <div className={styles.background} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// VolumeControl
// ─────────────────────────────────────────────────────────────────────────────

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) {
  const VolumeIcon = isMuted
    ? VolumeOffIcon
    : volume > 0.5
      ? VolumeFullIcon
      : VolumeHalfIcon;

  return (
    <Menu.Root>
      <Shortcut shortcut={{ label: "Volume", command: "M" }}>
        <Menu.Trigger
          render={
            <Button
              variant="ghost"
              className={styles.button}
              aria-label="Volume"
            >
              <VolumeIcon size={ICON_SIZE.small} />
            </Button>
          }
        />
      </Shortcut>
      <Menu.Portal>
        <Menu.Positioner
          className={styles.positioner}
          sideOffset={8}
          align="center"
          side="top"
        >
          <Menu.Popup className={styles.volume}>
            <Slider.Root
              value={isMuted ? 0 : volume * 100}
              onValueChange={(value) => {
                const v = Array.isArray(value) ? value[0] : value;
                if (v !== undefined) onVolumeChange(v / 100);
              }}
              orientation="vertical"
              aria-label="Volume"
              className={styles["volume-slider"]}
            >
              <Slider.Control className={styles["volume-control"]}>
                <Slider.Track className={styles["volume-track"]}>
                  <Slider.Indicator className={styles["volume-indicator"]} />
                  <Slider.Thumb className={styles["volume-thumb"]} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
            <Button
              variant="ghost"
              className={styles.button}
              onClick={onMuteToggle}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              <VolumeFullIcon size={ICON_SIZE.small} />
            </Button>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SettingsMenu
// ─────────────────────────────────────────────────────────────────────────────

interface SettingsMenuProps {
  autoScroll: boolean;
  canDownload: boolean;
  isLooping: boolean;
  playbackRate: PlaybackRate;
  onAutoScrollChange: (value: boolean) => void;
  onDownload: () => void;
  onLoopChange: (looping: boolean) => void;
  onPlaybackRateChange: (rate: PlaybackRate) => void;
}

function SettingsMenu(props: SettingsMenuProps) {
  return (
    <Menu.Root>
      <Shortcut shortcut={{ label: "Settings" }}>
        <Menu.Trigger
          render={
            <Button
              variant="ghost"
              className={styles.button}
              aria-label="Settings"
            >
              <VoiceSettingsIcon size={ICON_SIZE.large} />
            </Button>
          }
        />
      </Shortcut>
      <Menu.Portal>
        <Menu.Positioner
          className={styles.positioner}
          sideOffset={16}
          align="end"
          side="top"
        >
          <Menu.Popup className={styles.menu}>
            <Menu.CheckboxItem
              checked={props.autoScroll}
              onCheckedChange={props.onAutoScrollChange}
              className={styles.item}
            >
              Auto-scroll
              <Menu.CheckboxItemIndicator
                className={styles.check}
                keepMounted
                render={
                  <AnimatePresence initial={false}>
                    {props.autoScroll && (
                      <motion.div key="auto-scroll" {...ICON_TRANSITION}>
                        <Checkmark1Icon size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
              />
            </Menu.CheckboxItem>

            <Menu.CheckboxItem
              checked={props.isLooping}
              onCheckedChange={props.onLoopChange}
              className={styles.item}
            >
              Loop
              <Menu.CheckboxItemIndicator
                className={styles.check}
                keepMounted
                render={
                  <AnimatePresence initial={false}>
                    {props.isLooping && (
                      <motion.div key="loop" {...ICON_TRANSITION}>
                        <Checkmark1Icon size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
              />
            </Menu.CheckboxItem>

            <Menu.Separator className={styles.separator} />

            <Menu.Group className={styles.group}>
              <Menu.GroupLabel className={styles.label}>Speed</Menu.GroupLabel>
              <Menu.RadioGroup value={props.playbackRate.toString()}>
                {PLAYBACK_RATES.map((rate) => (
                  <Menu.RadioItem
                    key={rate}
                    value={rate.toString()}
                    closeOnClick={false}
                    onClick={() => props.onPlaybackRateChange(rate)}
                    className={styles.item}
                  >
                    <span>{rate}×</span>
                    <Menu.RadioItemIndicator
                      className={styles.check}
                      keepMounted
                      render={
                        <AnimatePresence initial={false}>
                          {props.playbackRate === rate && (
                            <motion.div
                              key={`speed-${rate}`}
                              {...ICON_TRANSITION}
                            >
                              <Checkmark1Icon size={16} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      }
                    />
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>

            <Menu.Separator className={styles.separator} />

            <Menu.Item
              className={styles.item}
              onClick={props.onDownload}
              disabled={!props.canDownload}
            >
              Download Audio
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MediaPlayer
// ─────────────────────────────────────────────────────────────────────────────

interface MediaPlayerProps {
  className?: string;
}

export function MediaPlayer({ className }: MediaPlayerProps) {
  const {
    page,
    colors,
    author,
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
    autoScroll,
    setAutoScroll,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isLooping,
    setIsLooping,
    download,
    audioUrl,
  } = useDocumentContext("MediaPlayer");

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
    !page.slugs?.length ||
    status === "idle" ||
    status === "loading" ||
    status === "error"
  ) {
    return null;
  }

  return (
    <Portal>
      <motion.div
        className={className ?? styles.player}
        initial={{ y: 100, opacity: 0 }}
        exit={{ y: 100, opacity: 0 }}
        animate={{
          y: isPlayerVisible ? 0 : 100,
          opacity: isPlayerVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <PlayerBackground />
        <div className={styles["player-controls"]}>
          <div className={styles.details}>
            <div className={styles.cover}>
              <Orb
                colors={colors}
                agentState={agentState}
                className={styles.shader}
              />
            </div>
            <div className={styles.info}>
              <div className={styles["player-title"]}>{page.data.title}</div>
              <div className={styles.author}>{author?.name}</div>
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
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setVolume}
              onMuteToggle={toggleMute}
            />
            <div className={styles.options}>
              <Shortcut shortcut={{ label: "Rewind", command: "-15s" }}>
                <Button
                  variant="ghost"
                  className={styles.button}
                  onClick={() => skipBackward()}
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
                  onClick={toggle}
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
                  className={styles.button}
                  onClick={() => skipForward()}
                  aria-label="Fast forward 15 seconds"
                >
                  <FastForwardIcon size={ICON_SIZE.small} />
                </Button>
              </Shortcut>
            </div>
            <SettingsMenu
              autoScroll={autoScroll}
              canDownload={!!audioUrl}
              isLooping={isLooping}
              playbackRate={playbackRate}
              onAutoScrollChange={setAutoScroll}
              onDownload={download}
              onLoopChange={setIsLooping}
              onPlaybackRateChange={setPlaybackRate}
            />
          </div>
        </div>
      </motion.div>
    </Portal>
  );
}
