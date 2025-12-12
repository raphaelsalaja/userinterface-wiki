"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import * as React from "react";

export interface SuggestionMenuProps<T> {
  items: T[];
  isOpen: boolean;
  selectedIndex: number;
  onSelect: (item: T) => void;
  renderItem: (item: T, isSelected: boolean, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
  getKey?: (item: T, index: number) => string | number;
}

export interface UseSuggestionFloatingOptions {
  placement?: Placement;
  offsetValue?: number;
}

/**
 * Hook for creating a floating suggestion menu attached to a virtual element (caret position)
 */
export function useSuggestionFloating(options: UseSuggestionFloatingOptions = {}) {
  const { placement = "bottom-start", offsetValue = 8 } = options;

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [
      offset(offsetValue),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const updatePosition = React.useCallback((rect: DOMRect) => {
    refs.setReference({
      getBoundingClientRect: () => rect,
    });
  }, [refs]);

  return {
    refs,
    floatingStyles,
    updatePosition,
  };
}

/**
 * Generic suggestion menu component
 */
export function SuggestionMenu<T>({
  items,
  isOpen,
  onSelect,
  renderItem,
  className,
  itemClassName,
  emptyMessage = "No results",
  getKey = (_, index) => index,
}: SuggestionMenuProps<T>) {
  const listRef = React.useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  if (items.length === 0) {
    return (
      <div className={className} data-suggestion-menu="">
        <div data-suggestion-empty="">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div ref={listRef} className={className} data-suggestion-menu="">
      {items.map((item, index) => (
        <button
          key={getKey(item, index)}
          type="button"
          className={itemClassName}
          data-suggestion-item=""
          onClick={() => onSelect(item)}
        >
          {renderItem(item, false, index)}
        </button>
      ))}
    </div>
  );
}
