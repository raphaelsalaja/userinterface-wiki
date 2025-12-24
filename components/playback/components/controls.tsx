"use client";

import { Slider } from "@base-ui/react/slider";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { PauseIcon, PlayIcon } from "@/icons";
import { ICON_TRANSITION } from "../playback.constants";
import type { ControlsProps } from "../playback.types";
import { formatTime } from "../playback.utils";
import interactiveStyles from "../styles/interactive.module.css";
import { SettingsMenu, VolumeControl } from "./menus";
import { Time, TooltipButton } from "./primitives";

export const Controls = ({
  isPlaying,
  currentTime,
  duration,
  progress,
  autoScroll,
  audioUrl,
  playbackRate,
  volume,
  isMuted,
  isLooping,
  onToggle,
  onSeek,
  onAutoScrollChange,
  onDownload,
  onPlaybackRateChange,
  onVolumeChange,
  onMuteToggle,
  onLoopChange,
  onCopyTimestamp,
}: ControlsProps) => (
  <React.Fragment>
    <TooltipButton
      onClick={onToggle}
      aria-label={isPlaying ? "Pause" : "Play"}
      label={isPlaying ? "Pause" : "Play"}
      shortcut="Space"
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div {...ICON_TRANSITION} key="pause">
            <PauseIcon />
          </motion.div>
        ) : (
          <motion.div {...ICON_TRANSITION} key="play">
            <PlayIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipButton>

    <VolumeControl
      volume={volume}
      isMuted={isMuted}
      onVolumeChange={onVolumeChange}
      onMuteToggle={onMuteToggle}
    />

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
  </React.Fragment>
);
