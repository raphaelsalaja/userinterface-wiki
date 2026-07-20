"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useNarrationStore } from "../store";

interface UseKeyboardShortcutsOptions {
  toggle: () => Promise<void>;
  seek: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PASSIVE = {
  preventDefault: false,
  stopPropagation: false,
  ignoreInputs: true,
} as const;

export function useKeyboardShortcuts({
  toggle,
  seek,
  audioRef,
}: UseKeyboardShortcutsOptions) {
  const toggleMute = useNarrationStore((state) => state.toggleMute);
  const isPlaying = useNarrationStore((state) => state.isPlaying);

  // Only prevent default for Space when audio is playing to avoid blocking scroll
  useHotkey(
    "Space",
    (event) => {
      if (isPlaying) {
        event.preventDefault();
      }
      toggle();
    },
    { ...PASSIVE, meta: { name: "Play / pause narration" } },
  );

  // Use shift+arrow keys to avoid blocking native scroll behavior
  useHotkey(
    "Shift+ArrowLeft",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - 5);
    },
    { ...PASSIVE, meta: { name: "Rewind 5 seconds" } },
  );

  useHotkey(
    "Shift+ArrowRight",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + 5);
    },
    { ...PASSIVE, meta: { name: "Forward 5 seconds" } },
  );

  // j/l for seeking (common video player pattern)
  useHotkey(
    "J",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - 15);
    },
    { ...PASSIVE, meta: { name: "Rewind 15 seconds" } },
  );

  useHotkey(
    "L",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + 15);
    },
    { ...PASSIVE, meta: { name: "Forward 15 seconds" } },
  );

  // m for mute
  useHotkey("M", () => toggleMute(), {
    ...PASSIVE,
    meta: { name: "Mute narration" },
  });
}
