import { normalizeWord } from "@/lib/strings";
import type { WordTimestamp } from "./types";

export interface WordPosition {
  node: Text;
  start: number;
  end: number;
  normalized: string;
}

const SKIP_TAGS = new Set([
  "code",
  "pre",
  "kbd",
  "var",
  "samp",
  "style",
  "script",
  "figure",
  "figcaption",
]);

let styleInjected = false;
let overlayElement: HTMLElement | null = null;

/**
 * Inject the highlight CSS at runtime
 */
function injectHighlightStyles(): void {
  if (styleInjected || typeof document === "undefined") return;

  try {
    const style = document.createElement("style");
    style.textContent = `
      .audio-word-overlay {
        position: absolute;
        pointer-events: none;
        background: var(--sky-a4);
        border-radius: 2px;
        opacity: 0;
        transition: all 180ms ease;
        z-index: 1;
        mix-blend-mode: multiply;
      }
      .audio-word-overlay.visible {
        opacity: 1;
      }
      @media (prefers-color-scheme: dark) {
        .audio-word-overlay {
          mix-blend-mode: screen;
        }
      }
    `;
    document.head.appendChild(style);
    styleInjected = true;
  } catch {
    // Ignore if injection fails
  }
}

/**
 * Get or create the overlay element used for highlighting
 */
function getOverlayElement(): HTMLElement {
  if (!overlayElement) {
    overlayElement = document.createElement("div");
    overlayElement.className = "audio-word-overlay";
    overlayElement.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlayElement);
  }
  return overlayElement;
}

/**
 * Collect all text nodes from the article, building word positions on-demand.
 * This runs once per article load, not per word.
 */
export function collectWordPositions(container: HTMLElement): WordPosition[] {
  const positions: WordPosition[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let node = walker.nextNode() as Text | null;
  while (node) {
    // Skip if inside excluded elements
    let skip = false;
    let parent = node.parentElement;
    while (parent && parent !== container) {
      if (SKIP_TAGS.has(parent.tagName.toLowerCase())) {
        skip = true;
        break;
      }
      // Skip footnotes
      if (parent.dataset.footnotes !== undefined) {
        skip = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (skip) {
      node = walker.nextNode() as Text | null;
      continue;
    }

    const text = node.textContent ?? "";
    if (!text.trim()) {
      node = walker.nextNode() as Text | null;
      continue;
    }

    // Split into words and track positions
    const regex = /\S+/g;
    let match = regex.exec(text);
    while (match !== null) {
      const normalized = normalizeWord(match[0]);
      if (normalized) {
        positions.push({
          node,
          start: match.index,
          end: match.index + match[0].length,
          normalized,
        });
      }
      match = regex.exec(text);
    }
    node = walker.nextNode() as Text | null;
  }

  return positions;
}

/**
 * Align timestamps to word positions (same logic as before, just different data structure)
 */
export function alignTimestamps(
  timestamps: WordTimestamp[],
  positions: WordPosition[],
): number[] {
  const mapping: number[] = new Array(timestamps.length).fill(-1);
  let posIndex = 0;

  for (let i = 0; i < timestamps.length; i++) {
    const normalized = timestamps[i]?.normalized;
    if (!normalized) continue;

    for (let j = posIndex; j < positions.length; j++) {
      if (positions[j]?.normalized === normalized) {
        mapping[i] = j;
        posIndex = j + 1;
        break;
      }
    }
  }

  return mapping;
}

/**
 * Create a highlight for a specific word position using an overlay element
 */
export function highlightWord(
  positions: WordPosition[],
  mapping: number[],
  wordIndex: number,
): void {
  injectHighlightStyles();

  const posIndex = mapping[wordIndex];
  if (typeof posIndex !== "number" || posIndex < 0) return;

  const pos = positions[posIndex];
  if (!pos) return;

  try {
    // Create a range to measure the word's position
    const range = new Range();
    range.setStart(pos.node, pos.start);
    range.setEnd(pos.node, pos.end);

    const rect = range.getBoundingClientRect();
    const overlay = getOverlayElement();

    // Position the overlay over the word
    overlay.style.left = `${window.scrollX + rect.left - 2}px`;
    overlay.style.top = `${window.scrollY + rect.top - 1}px`;
    overlay.style.width = `${rect.width + 4}px`;
    overlay.style.height = `${rect.height + 2}px`;

    // Make it visible (triggers transition)
    overlay.classList.add("visible");
  } catch {
    // Range might be invalid if DOM changed
  }
}

/**
 * Clear the current word highlight immediately (no transition)
 */
function clearHighlightImmediate(): void {
  if (overlayElement) {
    overlayElement.classList.remove("visible");
  }
}

/**
 * Clear the current word highlight with fade-out transition
 */
export function clearHighlight(): void {
  clearHighlightImmediate();
}

/**
 * Scroll the highlighted word into view
 */
export function scrollToWord(
  positions: WordPosition[],
  mapping: number[],
  wordIndex: number,
): void {
  const posIndex = mapping[wordIndex];
  if (typeof posIndex !== "number" || posIndex < 0) return;

  const pos = positions[posIndex];
  if (!pos) return;

  try {
    const range = new Range();
    range.setStart(pos.node, pos.start);
    range.setEnd(pos.node, pos.end);

    const rect = range.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const topThreshold = viewportHeight * 0.3;
    const bottomThreshold = viewportHeight * 0.7;

    if (rect.top < topThreshold || rect.bottom > bottomThreshold) {
      const scrollTarget = window.scrollY + rect.top - viewportHeight / 2;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  } catch {
    // Fallback - use overlay position
    if (overlayElement?.classList.contains("visible")) {
      const rect = overlayElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const topThreshold = viewportHeight * 0.3;
      const bottomThreshold = viewportHeight * 0.7;

      if (rect.top < topThreshold || rect.bottom > bottomThreshold) {
        const scrollTarget = window.scrollY + rect.top - viewportHeight / 2;
        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }
  }
}
