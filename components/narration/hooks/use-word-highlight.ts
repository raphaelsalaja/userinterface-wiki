"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  useDebounceCallback,
  useEventListener,
  useIsClient,
} from "usehooks-ts";
import {
  alignTimestamps,
  clearHighlight,
  collectWordPositions,
  destroyOverlay,
  highlightWord,
  scrollToWord,
  type WordPosition,
} from "../functions";
import { useNarrationStore } from "../store";
import type { WordTimestamp } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const BASE_WINDOW = 0.02;
const MAX_WINDOW = 0.12;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function resolveWindow(entry: WordTimestamp): number {
  const span = Math.max(
    BASE_WINDOW,
    Math.abs((entry.end ?? 0) - (entry.start ?? 0)),
  );
  return Math.min(MAX_WINDOW, span * 0.5);
}

function locateWordIndex(
  currentTime: number,
  timestamps: WordTimestamp[],
  lastIndex: number,
): number {
  if (!timestamps.length) return -1;

  const startOf = (entry: WordTimestamp) => entry.start ?? entry.end ?? 0;
  const endOf = (entry: WordTimestamp) => entry.end ?? entry.start ?? 0;

  const clampedLastIndex = Math.max(
    -1,
    Math.min(lastIndex, timestamps.length - 1),
  );

  // Check if we're still on the same word (common case during playback)
  if (clampedLastIndex >= 0) {
    const previous = timestamps[clampedLastIndex];
    if (previous) {
      const window = resolveWindow(previous);
      const prevStart = startOf(previous) - window;
      const prevEnd = endOf(previous) + window;

      if (currentTime >= prevStart && currentTime <= prevEnd) {
        return clampedLastIndex;
      }
    }
  }

  // Check if next word is the one (normal playback progression)
  if (clampedLastIndex >= 0 && clampedLastIndex + 1 < timestamps.length) {
    const next = timestamps[clampedLastIndex + 1];
    if (next) {
      const window = resolveWindow(next);
      if (
        currentTime >= startOf(next) - window &&
        currentTime <= endOf(next) + window
      ) {
        return clampedLastIndex + 1;
      }
    }
  }

  // For larger jumps (scrubbing), use binary search
  const firstTimestamp = timestamps[0];
  if (firstTimestamp && currentTime < startOf(firstTimestamp) - BASE_WINDOW) {
    return -1;
  }

  // Binary search to find the closest word
  let low = 0;
  let high = timestamps.length - 1;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    const midEntry = timestamps[mid];
    if (midEntry && currentTime >= startOf(midEntry) - BASE_WINDOW) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  // Verify the found index is within range
  const found = timestamps[low];
  if (!found) return low;

  const foundStart = startOf(found);
  const foundEnd = endOf(found);
  const window = resolveWindow(found);

  // Check if we're within this word's range
  if (currentTime >= foundStart - window && currentTime <= foundEnd + window) {
    return low;
  }

  // If past this word, might be in a gap before the next
  if (currentTime > foundEnd + window && low + 1 < timestamps.length) {
    const nextEntry = timestamps[low + 1];
    if (nextEntry && currentTime < startOf(nextEntry) - BASE_WINDOW) {
      return low; // In the gap, stay on current word
    }
    return low + 1;
  }

  return low;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseWordHighlightOptions {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function useWordHighlight({ containerRef }: UseWordHighlightOptions) {
  const isClient = useIsClient();
  const wordPositionsRef = useRef<WordPosition[]>([]);
  const mappingRef = useRef<number[]>([]);
  const lastWordIndexRef = useRef(-1);
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const timestamps = useNarrationStore((state) => state.timestamps);
  const isPlaying = useNarrationStore((state) => state.isPlaying);
  const currentTime = useNarrationStore((state) => state.currentTime);
  const autoScroll = useNarrationStore((state) => state.autoScroll);

  // Collect word positions when container changes
  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      if (containerRef.current) {
        wordPositionsRef.current = collectWordPositions(containerRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [containerRef]);

  // Align timestamps to word positions
  useEffect(() => {
    if (!timestamps.length || !wordPositionsRef.current.length) {
      mappingRef.current = [];
      return;
    }

    mappingRef.current = alignTimestamps(timestamps, wordPositionsRef.current);
  }, [timestamps]);

  // User scroll detection
  const resetUserScrolling = useDebounceCallback(() => {
    isUserScrollingRef.current = false;
  }, 800);

  const markScrolling = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    isUserScrollingRef.current = true;
    resetUserScrolling();
  }, [resetUserScrolling]);

  useEventListener("wheel", markScrolling, undefined, { passive: true });
  useEventListener("touchmove", markScrolling, undefined, { passive: true });

  // Visibility change sync
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible") return;
    lastWordIndexRef.current = -1;
  }, []);

  const documentRef = useRef<Document | null>(
    isClient ? document : null,
  ) as React.RefObject<Document>;

  useEventListener("visibilitychange", handleVisibilityChange, documentRef);

  // Track previous time for seek detection
  const prevTimeRef = useRef(0);

  // Apply word highlight
  const applyHighlight = useCallback(
    (wordIndex: number) => {
      highlightWord(wordPositionsRef.current, mappingRef.current, wordIndex);

      if (!autoScroll || isUserScrollingRef.current) return;

      isProgrammaticScrollRef.current = true;
      scrollToWord(wordPositionsRef.current, mappingRef.current, wordIndex);
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    },
    [autoScroll],
  );

  // Word highlighting during playback
  useEffect(() => {
    if (!timestamps.length || !isPlaying) return;

    // Detect large time jump (seek/scrub) - reset last index
    const timeDelta = Math.abs(currentTime - prevTimeRef.current);
    if (timeDelta > 1) {
      // More than 1 second jump = user scrubbed
      lastWordIndexRef.current = -1;
    }
    prevTimeRef.current = currentTime;

    const nextIndex = locateWordIndex(
      currentTime,
      timestamps,
      lastWordIndexRef.current,
    );

    if (nextIndex === lastWordIndexRef.current) return;

    lastWordIndexRef.current = nextIndex;

    if (nextIndex === -1) {
      clearHighlight();
      return;
    }

    applyHighlight(nextIndex);
  }, [applyHighlight, currentTime, isPlaying, timestamps]);

  // Clear highlight when paused
  useEffect(() => {
    if (isPlaying) return;
    lastWordIndexRef.current = -1;
    clearHighlight();
  }, [isPlaying]);

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      clearHighlight();
      destroyOverlay();
    };
  }, []);

  return {
    resetWordIndex: () => {
      lastWordIndexRef.current = -1;
    },
  };
}
