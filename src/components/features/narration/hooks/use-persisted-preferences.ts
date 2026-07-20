"use client";

import { useEffect, useState } from "react";
import { useIsClient, useLocalStorage } from "usehooks-ts";
import { useNarrationStore } from "../store";
import type { PlaybackRate } from "../types";

export function usePersistedPreferences() {
  const isClient = useIsClient();
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const {
    setVolume,
    toggleMute,
    setAutoScroll,
    setPlaybackRate,
    setIsLooping,
    volume,
    isMuted,
    autoScroll,
    playbackRate,
    isLooping,
  } = useNarrationStore();

  const [storedVolume, setStoredVolume] = useLocalStorage("audio-volume", 1);
  const [storedMuted, setStoredMuted] = useLocalStorage("audio-muted", false);
  const [storedAutoScroll, setStoredAutoScroll] = useLocalStorage(
    "audio-autoscroll",
    true,
  );
  const [storedPlaybackRate, setStoredPlaybackRate] =
    useLocalStorage<PlaybackRate>("audio-playback-rate", 1);
  const [storedLooping, setStoredLooping] = useLocalStorage(
    "audio-looping",
    false,
  );

  // Sync store from localStorage on mount (client-side only)
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount
  useEffect(() => {
    if (!isClient) return;
    setVolume(storedVolume);
    if (storedMuted) toggleMute();
    setAutoScroll(storedAutoScroll);
    setPlaybackRate(storedPlaybackRate);
    setIsLooping(storedLooping);
    setPreferencesLoaded(true);
  }, [isClient]);

  // Persist preferences to localStorage when they change
  useEffect(() => {
    if (!isClient || !preferencesLoaded) return;
    setStoredVolume(volume);
  }, [isClient, volume, setStoredVolume, preferencesLoaded]);

  useEffect(() => {
    if (!isClient || !preferencesLoaded) return;
    setStoredMuted(isMuted);
  }, [isClient, isMuted, setStoredMuted, preferencesLoaded]);

  useEffect(() => {
    if (!isClient || !preferencesLoaded) return;
    setStoredAutoScroll(autoScroll);
  }, [isClient, autoScroll, setStoredAutoScroll, preferencesLoaded]);

  useEffect(() => {
    if (!isClient || !preferencesLoaded) return;
    setStoredPlaybackRate(playbackRate);
  }, [isClient, playbackRate, setStoredPlaybackRate, preferencesLoaded]);

  useEffect(() => {
    if (!isClient || !preferencesLoaded) return;
    setStoredLooping(isLooping);
  }, [isClient, isLooping, setStoredLooping, preferencesLoaded]);

  return { preferencesLoaded };
}
