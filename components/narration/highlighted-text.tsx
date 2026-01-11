"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";
import {
  Children,
  Fragment,
  isValidElement,
  memo,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useCaptions } from "./hooks/use-captions";
import styles from "./styles.module.css";

/**
 * Normalize text for comparison (removes extra whitespace, normalizes unicode)
 */
function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, "")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, "-")
    .trim();
}

/**
 * Extract plain text from React children recursively
 */
function extractText(children: ReactNode): string {
  let text = "";

  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      text += child;
    } else if (typeof child === "number") {
      text += String(child);
    } else if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.props.children
    ) {
      text += extractText(child.props.children);
    }
  });

  return text;
}

/**
 * Split text into words while preserving whitespace positions
 */
function tokenize(text: string): { word: string; isSpace: boolean }[] {
  const tokens: { word: string; isSpace: boolean }[] = [];
  let current = "";
  let isCurrentSpace = false;

  for (const char of text) {
    const isSpace = /\s/.test(char);

    if (tokens.length === 0) {
      current = char;
      isCurrentSpace = isSpace;
      continue;
    }

    if (isSpace === isCurrentSpace) {
      current += char;
    } else {
      tokens.push({ word: current, isSpace: isCurrentSpace });
      current = char;
      isCurrentSpace = isSpace;
    }
  }

  if (current) {
    tokens.push({ word: current, isSpace: isCurrentSpace });
  }

  return tokens;
}

interface WordSpanProps {
  children: string;
  isActive: boolean;
  isPast: boolean;
  isPlaying: boolean;
}

const WordSpan = memo(function WordSpan({
  children,
  isActive,
  isPast,
  isPlaying,
}: WordSpanProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Scroll active word into view when playing
  useEffect(() => {
    if (isActive && isPlaying && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [isActive, isPlaying]);

  return (
    <span
      ref={ref}
      className={clsx(styles.highlight, {
        [styles.active]: isActive,
        [styles.past]: isPast,
      })}
    >
      {children}
    </span>
  );
});

export interface HighlightedTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps text content and highlights words synchronized with audio playback.
 * This component finds matching words from the alignment data and highlights them.
 */
export function HighlightedText({ children, className }: HighlightedTextProps) {
  const {
    available,
    isPlaying,
    currentWordIndex,
    text: alignmentText,
  } = useCaptions();

  // Extract text from children
  const childText = useMemo(() => extractText(children), [children]);
  const normalizedChildText = useMemo(
    () => normalizeText(childText),
    [childText],
  );

  // Find where this text appears in the alignment
  const textPosition = useMemo(() => {
    if (!available || !alignmentText) return null;

    const normalizedAlignment = normalizeText(alignmentText);
    const index = normalizedAlignment.indexOf(normalizedChildText);

    if (index === -1) return null;

    // Count words before this position
    const textBefore = normalizedAlignment.slice(0, index);
    const wordsBefore = textBefore.split(/\s+/).filter(Boolean).length;

    // Count words in this text
    const wordsInText = normalizedChildText.split(/\s+/).filter(Boolean).length;

    return {
      startWordIndex: wordsBefore,
      endWordIndex: wordsBefore + wordsInText,
    };
  }, [available, alignmentText, normalizedChildText]);

  // If not available or text not found in alignment, render normally
  if (!available || !textPosition) {
    return <span className={className}>{children}</span>;
  }

  // Tokenize the original text to preserve formatting
  const tokens = tokenize(childText);

  // Build the highlighted output
  let wordIndex = textPosition.startWordIndex;
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.isSpace) {
      // Preserve whitespace as-is
      elements.push(<Fragment key={`space-${i}`}>{token.word}</Fragment>);
    } else {
      // This is a word - check if it should be highlighted
      const isActive = isPlaying && wordIndex === currentWordIndex;
      const isPast =
        isPlaying && currentWordIndex >= 0 && wordIndex < currentWordIndex;

      elements.push(
        <WordSpan
          key={`word-${i}-${wordIndex}`}
          isActive={isActive}
          isPast={isPast}
          isPlaying={isPlaying}
        >
          {token.word}
        </WordSpan>,
      );

      wordIndex++;
    }
  }

  return <span className={className}>{elements}</span>;
}

/**
 * Wrapper component that applies highlighting to paragraph text
 */
export function HighlightedParagraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props}>
      <HighlightedText>{children}</HighlightedText>
    </p>
  );
}

/**
 * Wrapper component that applies highlighting to list items
 */
export function HighlightedListItem({
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props}>
      <HighlightedText>{children}</HighlightedText>
    </li>
  );
}
