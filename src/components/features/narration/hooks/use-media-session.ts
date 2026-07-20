"use client";

import { useCallback, useEffect } from "react";
import { useIsClient } from "usehooks-ts";
import { useNarrationStore } from "../store";

interface UseMediaSessionOptions {
  title: string;
  artist: string;
  colors: [string, string];
  audioRef: React.RefObject<HTMLAudioElement | null>;
  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
}

export function useMediaSession({
  title,
  artist,
  colors,
  audioRef,
  seek,
  skipForward,
  skipBackward,
}: UseMediaSessionOptions) {
  const isClient = useIsClient();
  const isPlaying = useNarrationStore((state) => state.isPlaying);
  const currentTime = useNarrationStore((state) => state.currentTime);
  const duration = useNarrationStore((state) => state.duration);

  // Generate artwork URL from colors
  const artworkUrl = useCallback(() => {
    if (!isClient) return null;

    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return canvas.toDataURL("image/png");
  }, [colors, isClient]);

  // Set up Media Session metadata and handlers
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const url = artworkUrl();
    const artwork: MediaImage[] = url
      ? [{ src: url, sizes: "512x512", type: "image/png" }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: "userinterface.wiki",
      artwork,
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });

    navigator.mediaSession.setActionHandler("seekbackward", () => {
      skipBackward();
    });

    navigator.mediaSession.setActionHandler("seekforward", () => {
      skipForward();
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) {
        seek(details.seekTime);
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [artworkUrl, artist, title, seek, skipBackward, skipForward, audioRef]);

  // Update playback state
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  // Update position state
  useEffect(() => {
    if (!("mediaSession" in navigator) || duration === 0) return;
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: Math.min(currentTime, duration),
    });
  }, [currentTime, duration]);
}
