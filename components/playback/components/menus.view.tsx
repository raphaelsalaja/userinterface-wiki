"use client";

import { Menu } from "@base-ui/react/menu";
import { Slider } from "@base-ui/react/slider";
import { Tooltip } from "@base-ui/react/tooltip";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckIcon,
  GearIcon,
  PlaylistIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMuteIcon,
} from "@/components/icons";
import { PLAYBACK_RATES } from "../playback.constants";
import type {
  ChaptersMenuProps,
  SettingsMenuProps,
  VolumeControlProps,
} from "../playback.types";
import popoverStyles from "../styles/popover.module.css";
import speedStyles from "../styles/speed.module.css";
import volumeStyles from "../styles/volume.module.css";
import { Kbd, MediaPlayerButton } from "./primitives";

export const ChaptersMenuView = ({
  chapters,
  onChapterClick,
}: ChaptersMenuProps) => (
  <Menu.Root>
    <Menu.Trigger render={<MediaPlayerButton aria-label="Chapters" />}>
      <PlaylistIcon />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner
        className={popoverStyles.positioner}
        sideOffset={8}
        align="end"
        side="top"
      >
        <Menu.Popup className={popoverStyles.popup}>
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <Menu.Item
                key={chapter.id}
                className={clsx(popoverStyles.item)}
                style={{ paddingLeft: `${(chapter.level - 1) * 12}px` }}
                onClick={() => onChapterClick(chapter.id)}
              >
                {chapter.number}. {chapter.text}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item className={popoverStyles.item} disabled>
              No chapters
            </Menu.Item>
          )}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

export const VolumeControlView = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) => {
  const VolumeIcon = isMuted
    ? VolumeMuteIcon
    : volume > 0.5
      ? VolumeHighIcon
      : VolumeLowIcon;

  return (
    <Menu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Menu.Trigger render={<MediaPlayerButton aria-label="Volume" />}>
              <VolumeIcon />
            </Menu.Trigger>
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8} side="top">
            <Tooltip.Popup className={popoverStyles.tooltip}>
              <span>Mute</span>
              <Kbd>M</Kbd>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Menu.Portal>
        <Menu.Positioner
          className={popoverStyles.positioner}
          sideOffset={8}
          align="center"
          side="top"
        >
          <Menu.Popup className={clsx(popoverStyles.popup, volumeStyles.popup)}>
            <Slider.Root
              value={isMuted ? 0 : volume * 100}
              onValueChange={(value) => {
                const v = Array.isArray(value) ? value[0] : value;
                if (v !== undefined) onVolumeChange(v / 100);
              }}
              orientation="vertical"
              aria-label="Volume"
              className={volumeStyles.slider}
            >
              <Slider.Control className={volumeStyles.control}>
                <Slider.Track className={volumeStyles.track}>
                  <Slider.Indicator className={volumeStyles.filled} />
                  <Slider.Thumb className={volumeStyles.thumb} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
            <MediaPlayerButton
              onClick={onMuteToggle}
              aria-label={isMuted ? "Unmute" : "Mute"}
              style={{ marginTop: 4 }}
            >
              <VolumeIcon />
            </MediaPlayerButton>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

export interface SettingsMenuViewProps
  extends Omit<SettingsMenuProps, "onCopyTimestamp"> {
  copied: boolean;
  onCopyClick: () => void;
}

export const SettingsMenuView = ({
  autoScroll,
  canDownload,
  isLooping,
  playbackRate,
  copied,
  onAutoScrollChange,
  onDownload,
  onLoopChange,
  onPlaybackRateChange,
  onCopyClick,
}: SettingsMenuViewProps) => (
  <Menu.Root>
    <Menu.Trigger render={<MediaPlayerButton aria-label="Settings" />}>
      <GearIcon />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner
        className={popoverStyles.positioner}
        sideOffset={16}
        align="end"
        side="top"
      >
        <Menu.Popup className={popoverStyles.popup}>
          <Menu.CheckboxItem
            checked={autoScroll}
            onCheckedChange={onAutoScrollChange}
            className={popoverStyles.item}
          >
            Auto-scroll
            <Menu.CheckboxItemIndicator
              className={popoverStyles.check}
              keepMounted
              render={
                <AnimatePresence initial={false}>
                  {autoScroll && (
                    <motion.div
                      key="check"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        filter: "blur(2px)",
                      }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
                      transition={{ duration: 0.18 }}
                    >
                      <CheckIcon size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              }
            />
          </Menu.CheckboxItem>

          <Menu.CheckboxItem
            checked={isLooping}
            onCheckedChange={onLoopChange}
            className={popoverStyles.item}
          >
            Loop
            <Menu.CheckboxItemIndicator
              className={popoverStyles.check}
              keepMounted
              render={
                <AnimatePresence initial={false}>
                  {isLooping && (
                    <motion.div
                      key="check"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        filter: "blur(2px)",
                      }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
                      transition={{ duration: 0.18 }}
                    >
                      <CheckIcon size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              }
            />
          </Menu.CheckboxItem>

          <Menu.Separator className={popoverStyles.separator} />

          <Menu.Group className={popoverStyles.group}>
            <Menu.GroupLabel className={popoverStyles.label}>
              Speed
            </Menu.GroupLabel>
            <Menu.RadioGroup value={playbackRate.toString()}>
              {PLAYBACK_RATES.map((rate) => (
                <Menu.RadioItem
                  key={rate}
                  value={rate.toString()}
                  closeOnClick={false}
                  onClick={() => onPlaybackRateChange(rate)}
                  className={clsx(popoverStyles.item, speedStyles.speedButton)}
                >
                  <span className={speedStyles.speedValue}>{rate}×</span>
                  <Menu.RadioItemIndicator
                    className={popoverStyles.check}
                    keepMounted
                    render={
                      <AnimatePresence initial={false}>
                        {playbackRate === rate && (
                          <motion.div
                            key="check"
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                              filter: "blur(2px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.8,
                              filter: "blur(2px)",
                            }}
                            transition={{ duration: 0.18 }}
                          >
                            <CheckIcon size={16} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    }
                  />
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Group>

          <Menu.Separator className={popoverStyles.separator} />

          <Menu.Item className={popoverStyles.item} onClick={onCopyClick}>
            {copied ? "Copied!" : "Share at Timestamp"}
          </Menu.Item>

          <Menu.Item
            className={popoverStyles.item}
            onClick={onDownload}
            disabled={!canDownload}
          >
            Download Audio
          </Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);
