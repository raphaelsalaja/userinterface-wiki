import { normalizeWord } from "@/lib/utils/strings";
import { BASE_WINDOW, MAX_WINDOW } from "./constants";
import type { WordTimestamp } from "./types";

/**
 * Formats a date string to "Jan 23, 2026" format.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function resolveWindow(entry: WordTimestamp): number {
  const span = Math.max(
    BASE_WINDOW,
    Math.abs((entry.end ?? 0) - (entry.start ?? 0)),
  );
  return Math.min(MAX_WINDOW, span * 0.5);
}

export interface SpanMeta {
  element: HTMLElement;
  normalized: string;
}

export function collectSpans(): SpanMeta[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-word-id]"),
  ).map((element) => ({
    element,
    normalized:
      element.dataset.wordNormalized ||
      normalizeWord(element.textContent ?? ""),
  }));
}

export function alignTimeline(
  timestamps: WordTimestamp[],
  spans: SpanMeta[],
): number[] {
  const mapping: number[] = new Array(timestamps.length).fill(-1);
  let spanIndex = 0;

  for (let entryIndex = 0; entryIndex < timestamps.length; entryIndex++) {
    const normalized = timestamps[entryIndex]?.normalized;
    if (!normalized) continue;

    for (let i = spanIndex; i < spans.length; i++) {
      const candidate = spans[i];
      if (!candidate?.normalized) continue;
      if (candidate.normalized === normalized) {
        mapping[entryIndex] = i;
        spanIndex = i + 1;
        break;
      }
    }
  }

  return mapping;
}

export function locateWordIndex(
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

  let index = clampedLastIndex;

  const firstTimestamp = timestamps[0];
  if (index === -1) {
    if (firstTimestamp && currentTime < startOf(firstTimestamp) - BASE_WINDOW) {
      return -1;
    }
    index = 0;
  }

  while (
    index + 1 < timestamps.length &&
    timestamps[index + 1] &&
    currentTime >= startOf(timestamps[index + 1] as WordTimestamp) - BASE_WINDOW
  ) {
    index += 1;
  }

  while (
    index > 0 &&
    timestamps[index] &&
    currentTime < startOf(timestamps[index] as WordTimestamp) - BASE_WINDOW
  ) {
    index -= 1;
  }

  const current = timestamps[index];
  if (!current) return index;

  const currentStart = startOf(current);
  const currentEnd = endOf(current);
  const window = resolveWindow(current);
  const withinCurrent =
    currentTime >= currentStart - window && currentTime <= currentEnd + window;

  if (withinCurrent) {
    return index;
  }

  if (currentTime > currentEnd + window) {
    if (index + 1 >= timestamps.length) {
      return timestamps.length - 1;
    }

    const nextTimestamp = timestamps[index + 1];
    if (nextTimestamp) {
      const nextStart = startOf(nextTimestamp);
      if (currentTime < nextStart - BASE_WINDOW) {
        return index;
      }
    }

    return index + 1;
  }

  if (currentTime < currentStart - window) {
    if (index === 0) {
      return -1;
    }
    return index - 1;
  }

  return index;
}
