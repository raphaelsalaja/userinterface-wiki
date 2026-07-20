"use client";

import { create } from "zustand";

interface AskAiState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Shared open state so the global Mod+K hotkey and any trigger buttons
 * control the same palette instance.
 */
export const useAskAiStore = create<AskAiState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
