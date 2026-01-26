"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import { useNarrationStore } from "../store";

export function useScrollDirection() {
  const lastScrollYRef = useRef(0);
  const hasBeenShownRef = useRef(false);
  const { scrollY } = useScroll();

  const isPlayerVisible = useNarrationStore((state) => state.isPlayerVisible);
  const setIsPlayerVisible = useNarrationStore(
    (state) => state.setIsPlayerVisible,
  );

  useEffect(() => {
    if (isPlayerVisible) {
      hasBeenShownRef.current = true;
    }
  }, [isPlayerVisible]);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (!hasBeenShownRef.current) return;

    const delta = current - lastScrollYRef.current;

    if (Math.abs(delta) < 10) {
      lastScrollYRef.current = current;
      return;
    }

    if (delta > 0 && current > 100 && isPlayerVisible) {
      setIsPlayerVisible(false);
    } else if (delta < 0 && !isPlayerVisible) {
      setIsPlayerVisible(true);
    }

    lastScrollYRef.current = current;
  });
}
