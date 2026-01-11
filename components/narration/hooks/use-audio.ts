"use client";

import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useNarrationStore } from "../store";

interface UseAudioOptions {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function useAudio(options: UseAudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const {
    audioUrl,
    duration,
    isPlaying,
    playbackRate,
    volume,
    isMuted,
    isLooping,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setAgentState,
    setError,
    setStatus,
  } = useNarrationStore(
    useShallow((state) => ({
      audioUrl: state.audioUrl,
      duration: state.duration,
      isPlaying: state.isPlaying,
      playbackRate: state.playbackRate,
      volume: state.volume,
      isMuted: state.isMuted,
      isLooping: state.isLooping,
      setIsPlaying: state.setIsPlaying,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
      setAgentState: state.setAgentState,
      setError: state.setError,
      setStatus: state.setStatus,
    })),
  );

  const startTicker = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const frame = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [setCurrentTime]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const handleMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setAgentState(null);
      setCurrentTime(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      options.onEnded?.();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setAgentState(null);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      options.onPause?.();
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setAgentState("talking");
      options.onPlay?.();
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audioRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setAgentState, setCurrentTime, setDuration, setIsPlaying, options]);

  // Load audio source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioUrl) {
      audio.src = "";
      audio.load();
      return;
    }

    audio.src = audioUrl;
    audio.currentTime = 0;
    audio.load();
  }, [audioUrl]);

  // Sync playback rate
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync looping
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLooping;
    }
  }, [isLooping]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      const playPromise = audioRef.current.play();
      playPromiseRef.current = playPromise;
      await playPromise;
      playPromiseRef.current = null;
      setIsPlaying(true);
      setAgentState("talking");
      startTicker();
    } catch (error) {
      playPromiseRef.current = null;
      // Ignore AbortError - this happens when pause() is called before play() resolves
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("[narration]", error);
      setError("Playback failed");
      setStatus("error");
    }
  }, [audioUrl, setAgentState, setError, setStatus, startTicker, setIsPlaying]);

  const pause = useCallback(async () => {
    if (!audioRef.current) return;

    // Wait for any pending play() promise to settle before pausing
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {
        // Ignore errors from the play promise
      }
      playPromiseRef.current = null;
    }

    audioRef.current.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
    setAgentState(null);
  }, [setAgentState, setIsPlaying]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;
      const clampedTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [duration, setCurrentTime],
  );

  const skipForward = useCallback(
    (seconds = 15) => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + seconds);
    },
    [seek],
  );

  const skipBackward = useCallback(
    (seconds = 15) => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - seconds);
    },
    [seek],
  );

  return {
    audioRef,
    play,
    pause,
    toggle,
    seek,
    skipForward,
    skipBackward,
    startTicker,
  };
}
