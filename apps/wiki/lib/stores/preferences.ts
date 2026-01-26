"use client";

import {
  createCollection,
  eq,
  localStorageCollectionOptions,
  useLiveQuery,
} from "@tanstack/react-db";
import { useEffect, useState } from "react";
import { z } from "zod";

/**
 * User preferences stored in localStorage with cross-tab sync.
 */

const preferencesSchema = z.object({
  id: z.literal("user"),
  viewMode: z.enum(["card", "row"]),
});

export type Preferences = z.infer<typeof preferencesSchema>;
export type ViewMode = Preferences["viewMode"];

export const preferencesCollection = createCollection(
  localStorageCollectionOptions({
    id: "user-preferences",
    storageKey: "userinterface-wiki-preferences",
    getKey: (item) => item.id,
    schema: preferencesSchema,
  }),
);

const DEFAULT_PREFERENCES: Preferences = {
  id: "user",
  viewMode: "card",
};

/**
 * Hook to get user preferences with live updates.
 * Handles SSR by returning defaults until hydrated.
 */
export function usePreferences() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [viewMode, setViewModeState] = useState<ViewMode>(
    DEFAULT_PREFERENCES.viewMode,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Subscribe to live updates - returns empty during SSR
  const { data: prefs } = useLiveQuery((q) =>
    q
      .from({ pref: preferencesCollection })
      .where(({ pref }) => eq(pref.id, "user")),
  );

  // Sync state with collection data after hydration
  useEffect(() => {
    if (isHydrated && prefs?.[0]) {
      setViewModeState(prefs[0].viewMode);
    }
  }, [isHydrated, prefs]);

  const setViewMode = (newViewMode: ViewMode) => {
    setViewModeState(newViewMode);
    const existing = preferencesCollection.state.get("user");
    if (existing) {
      preferencesCollection.update("user", (draft) => {
        draft.viewMode = newViewMode;
      });
    } else {
      preferencesCollection.insert({
        id: "user",
        viewMode: newViewMode,
      });
    }
  };

  return {
    viewMode,
    setViewMode,
  };
}
