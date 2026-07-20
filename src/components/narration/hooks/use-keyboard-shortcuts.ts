"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useNarrationStore } from "../store";

interface UseKeyboardShortcutsOptions {
  toggle: () => Promise<void>;
  seek: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function useKeyboardShortcuts({
  toggle,
  seek,
  audioRef,
}: UseKeyboardShortcutsOptions) {
  const toggleMute = useNarrationStore((state) => state.toggleMute);
  const isPlaying = useNarrationStore((state) => state.isPlaying);

  // Only prevent default for Space when audio is playing to avoid blocking scroll
  useHotkeys(
    "space",
    (e) => {
      if (isPlaying) {
        e.preventDefault();
      }
      toggle();
    },
    { enableOnFormTags: false, preventDefault: false },
  );

  // Use shift+arrow keys to avoid blocking native scroll behavior
  useHotkeys(
    "shift+left",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - 5);
    },
    { enableOnFormTags: false },
  );

  useHotkeys(
    "shift+right",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + 5);
    },
    { enableOnFormTags: false },
  );

  // j/l for seeking (common video player pattern)
  useHotkeys(
    "j",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - 15);
    },
    { enableOnFormTags: false },
  );

  useHotkeys(
    "l",
    () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + 15);
    },
    { enableOnFormTags: false },
  );

  // m for mute
  useHotkeys("m", () => toggleMute(), { enableOnFormTags: false });
}
