"use client";

import { Slider } from "@base-ui/react/slider";
import clsx from "clsx";
import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Orb } from "../orb";
import { SettingsMenu, VolumeControl } from "./components/menus";
import { Time, TooltipButton } from "./components/primitives";
import { ICON_TRANSITION } from "./playback.constants";
import { usePlayback } from "./playback.hook";
import type { PlaybackRate } from "./playback.store";
import type { PlaybackProps } from "./playback.types";
import { formatTime } from "./playback.utils";
import interactiveStyles from "./styles/interactive.module.css";
import styles from "./styles/layout.module.css";

export const Playback = ({
  slugSegments,
  title,
  authorName,
}: PlaybackProps) => {
  const {
    isPlaying,
    duration,
    currentTime,
    agentState,
    handleToggle,
    seek,
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
    copyTimestampUrl,
    audioUrl,
    colors,
  } = usePlayback({ slugSegments, title, authorName });

  const readerRef = React.useRef<HTMLDivElement | null>(null);
  const [_isReaderVisible, setIsReaderVisible] = React.useState(true);

  const handleDownload = React.useCallback(() => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${slugSegments.join("-")}.mp3`;
    link.click();
  }, [audioUrl, slugSegments]);

  const progress =
    duration > 0
      ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
      : 0;

  const handleSeek = React.useCallback(
    (value: number | number[]) => {
      const percent = Array.isArray(value) ? value[0] : value;
      if (percent === undefined || duration <= 0) return;
      seek((percent / 100) * duration);
    },
    [duration, seek],
  );

  React.useEffect(() => {
    const target = readerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsReaderVisible(entry?.isIntersecting ?? false),
      { threshold: 0.4 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const onToggle = handleToggle;
  const onSeek = handleSeek;
  const onAutoScrollChange = setAutoScroll;
  const onDownload = handleDownload;
  const onPlaybackRateChange = setPlaybackRate;
  const onVolumeChange = setVolume;
  const onMuteToggle = toggleMute;
  const onLoopChange = setIsLooping;
  const onCopyTimestamp = copyTimestampUrl;

  return (
    <div ref={readerRef} className={styles.reader}>
      <div className={styles.details}>
        <div className={styles.cover}>
          <div className={styles.glow}>
            <Orb
              colors={colors}
              agentState={agentState}
              className={styles.canvas}
            />
          </div>
          <div className={styles.orb}>
            <Orb
              colors={colors}
              agentState={agentState}
              className={styles.canvas}
            />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.title} title={title}>
            {title}
          </div>
          <div className={styles.author}>{authorName}</div>
        </div>
        <div className={styles.voice}>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
          />
        </div>
      </div>

      <Slider.Root
        value={progress}
        onValueChange={onSeek}
        aria-label="Playback progress"
        className={clsx(interactiveStyles.slider)}
      >
        <Time>{formatTime(currentTime)}</Time>
        <Slider.Control className={interactiveStyles.control}>
          <Slider.Track className={interactiveStyles.track}>
            <Slider.Indicator className={interactiveStyles.indicator} />
            <Slider.Thumb className={interactiveStyles.thumb} />
          </Slider.Track>
        </Slider.Control>
        <Time>{formatTime(duration)}</Time>
      </Slider.Root>

      <div className={styles.actions}>
        <div className={styles.left}>
          <TooltipButton
            onClick={() => {
              const rates: PlaybackRate[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
              const currentIndex = rates.indexOf(playbackRate);
              const nextIndex = (currentIndex + 1) % rates.length;
              onPlaybackRateChange(rates[nextIndex] ?? 1);
            }}
            aria-label={`Playback speed: ${playbackRate}x`}
            label={`Speed: ${playbackRate}x`}
            className={interactiveStyles.speed}
          >
            {playbackRate}
          </TooltipButton>
        </div>
        <div className={styles.center}>
          <TooltipButton
            onClick={() => seek(Math.max(0, currentTime - 15))}
            aria-label="Rewind 15 seconds"
            label="Rewind"
            shortcut="-15s"
          >
            <Rewind />
          </TooltipButton>
          <TooltipButton
            onClick={onToggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            label={isPlaying ? "Pause" : "Play"}
            shortcut="Space"
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div {...ICON_TRANSITION} key="pause">
                  <Pause />
                </motion.div>
              ) : (
                <motion.div {...ICON_TRANSITION} key="play">
                  <Play />
                </motion.div>
              )}
            </AnimatePresence>
          </TooltipButton>
          <TooltipButton
            onClick={() => seek(Math.min(duration, currentTime + 15))}
            aria-label="Fast forward 15 seconds"
            label="Fast Forward"
            shortcut="+15s"
          >
            <FastForward />
          </TooltipButton>
        </div>
        <div className={styles.right}>
          <SettingsMenu
            autoScroll={autoScroll}
            canDownload={!!audioUrl}
            isLooping={isLooping}
            playbackRate={playbackRate}
            onAutoScrollChange={onAutoScrollChange}
            onDownload={onDownload}
            onLoopChange={onLoopChange}
            onPlaybackRateChange={onPlaybackRateChange}
            onCopyTimestamp={onCopyTimestamp}
          />
        </div>
      </div>
    </div>
  );
};
