import type { WordPosition } from "./collect-word-positions";

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
 * Get the current overlay element (for external use)
 */
export function getOverlay(): HTMLElement | null {
  return overlayElement;
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
    const range = new Range();
    range.setStart(pos.node, pos.start);
    range.setEnd(pos.node, pos.end);

    const rect = range.getBoundingClientRect();
    const overlay = getOverlayElement();

    overlay.style.left = `${window.scrollX + rect.left - 2}px`;
    overlay.style.top = `${window.scrollY + rect.top - 1}px`;
    overlay.style.width = `${rect.width + 4}px`;
    overlay.style.height = `${rect.height + 2}px`;

    overlay.classList.add("visible");
  } catch {
    // Range might be invalid if DOM changed
  }
}

/**
 * Clear the current word highlight
 */
export function clearHighlight(): void {
  if (overlayElement) {
    overlayElement.classList.remove("visible");
  }
}

/**
 * Destroy and remove the overlay element completely
 */
export function destroyOverlay(): void {
  if (overlayElement) {
    overlayElement.remove();
    overlayElement = null;
  }
}
