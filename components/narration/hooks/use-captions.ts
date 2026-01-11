"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useNarrationStore } from "../store";
import type { Alignment } from "../types";

/**
 * Word segment with timing information derived from character alignments
 */
export interface WordSegment {
  /** The word text */
  word: string;
  /** Start time in seconds */
  startTime: number;
  /** End time in seconds */
  endTime: number;
  /** Start index in the character array */
  startIndex: number;
  /** End index in the character array (exclusive) */
  endIndex: number;
}

/**
 * Convert character-level alignment to word-level segments
 */
function buildWordSegments(alignment: Alignment): WordSegment[] {
  const {
    characters,
    character_start_times_seconds,
    character_end_times_seconds,
  } = alignment;
  const words: WordSegment[] = [];

  let wordStart = -1;
  let wordChars: string[] = [];

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const isWhitespace = char === " " || char === "\n" || char === "\t";
    const _isPunctuation = /^[.,!?;:'"()\-–—]$/.test(char);

    if (isWhitespace) {
      // End current word if we have one
      if (wordChars.length > 0 && wordStart >= 0) {
        words.push({
          word: wordChars.join(""),
          startTime: character_start_times_seconds[wordStart],
          endTime: character_end_times_seconds[i - 1],
          startIndex: wordStart,
          endIndex: i,
        });
        wordChars = [];
        wordStart = -1;
      }
    } else {
      // Start new word or continue current
      if (wordStart < 0) {
        wordStart = i;
      }
      wordChars.push(char);

      // Check if this is the last character
      if (i === characters.length - 1 && wordChars.length > 0) {
        words.push({
          word: wordChars.join(""),
          startTime: character_start_times_seconds[wordStart],
          endTime: character_end_times_seconds[i],
          startIndex: wordStart,
          endIndex: i + 1,
        });
      }
    }
  }

  return words;
}

/**
 * Find the current word index based on playback time
 */
function findCurrentWordIndex(
  words: WordSegment[],
  currentTime: number,
): number {
  if (words.length === 0) return -1;

  // Binary search for efficiency with large texts
  let low = 0;
  let high = words.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const word = words[mid];

    if (currentTime >= word.startTime && currentTime < word.endTime) {
      return mid;
    }
    if (currentTime < word.startTime) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // Check if we're past the last word
  const lastWord = words[words.length - 1];
  if (currentTime >= lastWord.endTime) {
    return words.length - 1;
  }

  return -1;
}

/**
 * Find the current character index based on playback time
 */
function findCurrentCharIndex(
  alignment: Alignment,
  currentTime: number,
): number {
  const { character_start_times_seconds, character_end_times_seconds } =
    alignment;

  for (let i = 0; i < character_start_times_seconds.length; i++) {
    if (
      currentTime >= character_start_times_seconds[i] &&
      currentTime < character_end_times_seconds[i]
    ) {
      return i;
    }
  }

  // Check if we're past the last character
  if (character_end_times_seconds.length > 0) {
    const lastEnd =
      character_end_times_seconds[character_end_times_seconds.length - 1];
    if (currentTime >= lastEnd) {
      return character_start_times_seconds.length - 1;
    }
  }

  return -1;
}

export interface CaptionsState {
  /** Whether captions are available */
  available: boolean;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Word segments derived from alignment */
  words: WordSegment[];
  /** Index of the currently spoken word (-1 if none) */
  currentWordIndex: number;
  /** The currently spoken word or null */
  currentWord: WordSegment | null;
  /** Index of the currently spoken character (-1 if none) */
  currentCharIndex: number;
  /** Full text reconstructed from alignment */
  text: string;
  /** Progress through current word (0-1) */
  wordProgress: number;
}

/**
 * Hook for accessing word-level captions synchronized with audio playback
 */
export function useCaptions(): CaptionsState {
  // Subscribe to store updates for reactive state
  const alignment = useSyncExternalStore(
    useNarrationStore.subscribe,
    () => useNarrationStore.getState().alignment,
    () => null,
  );

  const currentTime = useSyncExternalStore(
    useNarrationStore.subscribe,
    () => useNarrationStore.getState().currentTime,
    () => 0,
  );

  const isPlaying = useSyncExternalStore(
    useNarrationStore.subscribe,
    () => useNarrationStore.getState().isPlaying,
    () => false,
  );

  // Build word segments from alignment (memoized)
  const words = useMemo(() => {
    if (!alignment) return [];
    return buildWordSegments(alignment);
  }, [alignment]);

  // Reconstruct full text (memoized)
  const text = useMemo(() => {
    if (!alignment) return "";
    return alignment.characters.join("");
  }, [alignment]);

  // Find current indices
  const currentWordIndex = useMemo(() => {
    if (!isPlaying || words.length === 0) return -1;
    return findCurrentWordIndex(words, currentTime);
  }, [words, currentTime, isPlaying]);

  const currentCharIndex = useMemo(() => {
    if (!isPlaying || !alignment) return -1;
    return findCurrentCharIndex(alignment, currentTime);
  }, [alignment, currentTime, isPlaying]);

  const currentWord = currentWordIndex >= 0 ? words[currentWordIndex] : null;

  // Calculate progress through current word
  const wordProgress = useMemo(() => {
    if (!currentWord) return 0;
    const duration = currentWord.endTime - currentWord.startTime;
    if (duration <= 0) return 0;
    const elapsed = currentTime - currentWord.startTime;
    return Math.min(Math.max(elapsed / duration, 0), 1);
  }, [currentWord, currentTime]);

  return {
    available: alignment !== null,
    isPlaying,
    currentTime,
    words,
    currentWordIndex,
    currentWord,
    currentCharIndex,
    text,
    wordProgress,
  };
}
