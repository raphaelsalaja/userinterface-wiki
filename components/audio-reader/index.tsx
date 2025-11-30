"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PauseIcon } from "@/components/icons/pause";
import { PlayIcon } from "@/components/icons/play";
import { normalizeWord } from "@/lib/text/normalize-word";
import styles from "./styles.module.css";

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  normalized: string;
}

const HIGHLIGHT_TOLERANCE = 0.05;

interface ReaderResponse {
  audioUrl: string;
  timestamps: WordTimestamp[];
}

interface SpanMeta {
  element: HTMLElement;
  normalized: string;
}

interface AudioReaderProps {
  slugSegments: string[];
}

export const AudioReader = ({ slugSegments }: AudioReaderProps) => {
  const slugKey = useMemo(() => slugSegments.join("/"), [slugSegments]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const spansRef = useRef<SpanMeta[]>([]);
  const mappingRef = useRef<number[]>([]);
  const activeSpanRef = useRef<HTMLElement | null>(null);
  const activeBlockRef = useRef<HTMLElement | null>(null);
  const lastWordIndexRef = useRef(-1);
  const isUserScrollingRef = useRef(false);
  const scrollTimerRef = useRef<number | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<WordTimestamp[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const prefersReducedMotion = usePrefersReducedMotion();

  const clearActiveHighlight = useCallback(() => {
    if (activeSpanRef.current) {
      delete activeSpanRef.current.dataset.wordState;
      activeSpanRef.current = null;
    }

    if (activeBlockRef.current) {
      delete activeBlockRef.current.dataset.wordBlockState;
      activeBlockRef.current = null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNarration = async () => {
      setStatus("loading");
      setErrorMessage(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioUrl(null);
      lastWordIndexRef.current = -1;
      setTimestamps([]);

      try {
        const response = await fetch("/api/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: slugKey }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const { error } = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(error ?? "Unable to load narration");
        }

        const data = (await response.json()) as ReaderResponse;

        setAudioUrl(data.audioUrl ?? null);
        setTimestamps(data.timestamps ?? []);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[audio-reader]", error);
        setAudioUrl(null);
        setIsPlaying(false);
        setTimestamps([]);
        setErrorMessage("Audio unavailable right now");
        setStatus("error");
      }
    };

    fetchNarration();

    return () => controller.abort();
  }, [slugKey]);

  useEffect(() => {
    if (!slugKey) return;

    spansRef.current = collectSpans();
    mappingRef.current = [];
    activeSpanRef.current = null;
    activeBlockRef.current = null;
    lastWordIndexRef.current = -1;
  }, [slugKey]);

  useEffect(() => {
    if (!timestamps.length || !spansRef.current.length) {
      mappingRef.current = [];
      return;
    }

    mappingRef.current = alignTimeline(timestamps, spansRef.current);
  }, [timestamps]);

  useEffect(() => {
    const markScrolling = () => {
      isUserScrollingRef.current = true;
      if (typeof scrollTimerRef.current === "number") {
        window.clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1200);
    };

    window.addEventListener("wheel", markScrolling, { passive: true });
    window.addEventListener("touchmove", markScrolling, { passive: true });

    return () => {
      window.removeEventListener("wheel", markScrolling);
      window.removeEventListener("touchmove", markScrolling);
      if (typeof scrollTimerRef.current === "number") {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const handleMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastWordIndexRef.current = -1;
      clearActiveHighlight();
    };
    const handlePause = () => {
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    const handlePlay = () => setIsPlaying(true);

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
  }, [clearActiveHighlight]);

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

  const handleToggle = useCallback(async () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(function frame() {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
        rafRef.current = requestAnimationFrame(frame);
      });
    } catch (error) {
      console.error("[audio-reader]", error);
      setErrorMessage("Playback failed");
      setStatus("error");
    }
  }, [audioUrl, isPlaying]);

  const applyHighlight = useCallback(
    (wordIndex: number) => {
      const spanIndex = mappingRef.current[wordIndex];
      if (typeof spanIndex !== "number" || spanIndex < 0) return;

      const meta = spansRef.current[spanIndex];
      if (!meta || activeSpanRef.current === meta.element) return;

      clearActiveHighlight();
      activeSpanRef.current = meta.element;
      activeSpanRef.current.dataset.wordState = "active";

      const block = meta.element.closest<HTMLElement>(
        "p, li, blockquote, h1, h2, h3, h4, h5, h6",
      );
      if (block) {
        activeBlockRef.current = block;
        block.dataset.wordBlockState = "active";
      }

      if (prefersReducedMotion || isUserScrollingRef.current) return;

      const rect = meta.element.getBoundingClientRect();
      const offset = window.innerHeight * 0.2;
      const outOfView =
        rect.top < offset || rect.bottom > window.innerHeight - offset;

      if (outOfView) {
        meta.element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [clearActiveHighlight, prefersReducedMotion],
  );

  useEffect(() => {
    if (!timestamps.length) return;

    const nextIndex = locateWordIndex(
      currentTime,
      timestamps,
      lastWordIndexRef.current,
    );

    if (nextIndex === lastWordIndexRef.current) return;

    lastWordIndexRef.current = nextIndex;

    if (nextIndex === -1) {
      clearActiveHighlight();
      return;
    }

    applyHighlight(nextIndex);
  }, [applyHighlight, clearActiveHighlight, currentTime, timestamps]);

  if (status === "error") {
    return (
      <div className={styles.reader}>
        <p className={styles.message}>{errorMessage ?? "Audio unavailable"}</p>
      </div>
    );
  }

  return (
    <div className={styles.reader}>
      <button
        type="button"
        className={styles.button}
        onClick={handleToggle}
        disabled={status === "loading" || !audioUrl}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause narration" : "Play narration"}
      >
        {status === "loading" ? (
          <span className={styles.spinner} aria-live="polite">
            Loading…
          </span>
        ) : isPlaying ? (
          <PauseIcon size={20} />
        ) : (
          <PlayIcon size={20} />
        )}
      </button>

      <div className={styles.progress} aria-hidden="true">
        <div
          className={styles.bar}
          style={{
            width: duration ? `${(currentTime / duration) * 100}%` : "0%",
          }}
        />
      </div>

      <div className={styles.info}>
        <span className={styles.time}>{formatTime(currentTime)}</span>
        <span className={styles.divider}>/</span>
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

function collectSpans(): SpanMeta[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-word-id]"),
  ).map((element) => ({
    element,
    normalized:
      element.dataset.wordNormalized ||
      normalizeWord(element.textContent ?? ""),
  }));
}

function alignTimeline(timestamps: WordTimestamp[], spans: SpanMeta[]) {
  const mapping: number[] = new Array(timestamps.length).fill(-1);
  let spanIndex = 0;

  timestamps.forEach((entry, entryIndex) => {
    const normalized = entry.normalized;
    if (!normalized) return;

    for (let i = spanIndex; i < spans.length; i++) {
      const candidate = spans[i];
      if (!candidate.normalized) continue;
      if (candidate.normalized === normalized) {
        mapping[entryIndex] = i;
        spanIndex = i + 1;
        return;
      }
    }
  });

  return mapping;
}

function locateWordIndex(
  currentTime: number,
  timestamps: WordTimestamp[],
  lastIndex: number,
) {
  if (!timestamps.length) return -1;

  const startOf = (entry: WordTimestamp) => entry.start ?? entry.end ?? 0;
  const endOf = (entry: WordTimestamp) => entry.end ?? entry.start ?? 0;

  let index = Math.max(-1, Math.min(lastIndex, timestamps.length - 1));

  if (index === -1) {
    if (currentTime < startOf(timestamps[0]) - HIGHLIGHT_TOLERANCE) {
      return -1;
    }
    index = 0;
  }

  while (
    index + 1 < timestamps.length &&
    currentTime >= startOf(timestamps[index + 1]) - HIGHLIGHT_TOLERANCE
  ) {
    index += 1;
  }

  while (
    index > 0 &&
    currentTime < startOf(timestamps[index]) - HIGHLIGHT_TOLERANCE
  ) {
    index -= 1;
  }

  const current = timestamps[index];
  const currentStart = startOf(current);
  const currentEnd = endOf(current);

  const withinCurrent =
    currentTime >= currentStart - HIGHLIGHT_TOLERANCE &&
    currentTime <= currentEnd + HIGHLIGHT_TOLERANCE;

  if (withinCurrent) {
    return index;
  }

  if (currentTime > currentEnd + HIGHLIGHT_TOLERANCE) {
    if (index + 1 >= timestamps.length) {
      return timestamps.length - 1;
    }

    const nextStart = startOf(timestamps[index + 1]);
    if (currentTime < nextStart - HIGHLIGHT_TOLERANCE) {
      return index;
    }

    return index + 1;
  }

  if (currentTime < currentStart - HIGHLIGHT_TOLERANCE) {
    if (index === 0) {
      return -1;
    }
    return index - 1;
  }

  return index;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(media.matches);

    const handler = () => setPrefers(media.matches);
    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, []);

  return prefers;
}
