"use client";

import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db";
import { useEffect, useState } from "react";
import { z } from "zod";

/**
 * Per-article reading progress stored in localStorage with cross-tab sync.
 * No accounts, no backend — completion state lives on the device.
 */

const progressSchema = z.object({
  slug: z.string(),
  completedAt: z.string(),
});

export type ProgressEntry = z.infer<typeof progressSchema>;

export const progressCollection = createCollection(
  localStorageCollectionOptions({
    id: "reading-progress",
    storageKey: "userinterface-wiki-progress",
    getKey: (item) => item.slug,
    schema: progressSchema,
  }),
);

/**
 * Hook for reading progress with live updates.
 * Subscribes after mount (returning an empty set on the server and first
 * client render) so statically prerendered pages hydrate cleanly.
 */
export function useProgress() {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const update = () => {
      setCompletedSlugs(new Set(progressCollection.state.keys()));
    };

    progressCollection.startSyncImmediate();
    update();

    const subscription = progressCollection.subscribeChanges(update);
    return () => subscription.unsubscribe();
  }, []);

  const isCompleted = (slug: string) => completedSlugs.has(slug);

  const toggleCompleted = (slug: string) => {
    if (progressCollection.state.get(slug)) {
      progressCollection.delete(slug);
    } else {
      progressCollection.insert({
        slug,
        completedAt: new Date().toISOString(),
      });
    }
  };

  return { completedSlugs, isCompleted, toggleCompleted };
}
