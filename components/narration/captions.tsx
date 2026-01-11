"use client";

import { clsx } from "clsx";
import { memo, useCallback, useEffect, useRef } from "react";
import { useCaptions, type WordSegment } from "./hooks/use-captions";
import styles from "./styles.module.css";

interface WordProps {
  segment: WordSegment;
  isActive: boolean;
  isPast: boolean;
  progress: number;
  onClick?: (startTime: number) => void;
}

const Word = memo(function Word({
  segment,
  isActive,
  isPast,
  progress,
  onClick,
}: WordProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Scroll active word into view
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isActive]);

  const handleClick = useCallback(() => {
    onClick?.(segment.startTime);
  }, [onClick, segment.startTime]);

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles.word, {
        [styles.active]: isActive,
        [styles.past]: isPast,
      })}
      style={
        isActive
          ? ({ "--word-progress": progress } as React.CSSProperties)
          : undefined
      }
      onClick={handleClick}
      data-start={segment.startTime.toFixed(2)}
      data-end={segment.endTime.toFixed(2)}
    >
      {segment.word}
    </button>
  );
});

export interface CaptionsProps {
  /** Additional class name */
  className?: string;
  /** Callback when a word is clicked (receives start time) */
  onSeek?: (time: number) => void;
  /** Render prop for custom word rendering */
  renderWord?: (props: {
    segment: WordSegment;
    isActive: boolean;
    isPast: boolean;
    progress: number;
  }) => React.ReactNode;
}

/**
 * Displays synchronized captions with word-level highlighting
 */
export function Captions({ className, onSeek, renderWord }: CaptionsProps) {
  const { available, words, currentWordIndex, wordProgress } = useCaptions();

  if (!available || words.length === 0) {
    return null;
  }

  return (
    <section
      className={clsx(styles.captions, className)}
      aria-label="Audio captions"
      aria-live="off"
    >
      {words.map((segment, index) => {
        const isActive = index === currentWordIndex;
        const isPast = currentWordIndex >= 0 && index < currentWordIndex;
        const progress = isActive ? wordProgress : 0;

        if (renderWord) {
          return (
            <span key={`${segment.startIndex}-${segment.word}`}>
              {renderWord({ segment, isActive, isPast, progress })}
            </span>
          );
        }

        return (
          <Word
            key={`${segment.startIndex}-${segment.word}`}
            segment={segment}
            isActive={isActive}
            isPast={isPast}
            progress={progress}
            onClick={onSeek}
          />
        );
      })}
    </section>
  );
}
