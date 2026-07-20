"use client";

import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db";
import { useEffect, useState } from "react";
import { z } from "zod";

/**
 * Bookmarked articles stored in localStorage with cross-tab sync.
 * No accounts, no backend — bookmarks live on the device.
 */

const bookmarkSchema = z.object({
  slug: z.string(),
  bookmarkedAt: z.string(),
});

export type BookmarkEntry = z.infer<typeof bookmarkSchema>;

export const bookmarksCollection = createCollection(
  localStorageCollectionOptions({
    id: "bookmarks",
    storageKey: "userinterface-wiki-bookmarks",
    getKey: (item) => item.slug,
    schema: bookmarkSchema,
  }),
);

/**
 * Hook for bookmarks with live updates.
 * Subscribes after mount (returning an empty set on the server and first
 * client render) so statically prerendered pages hydrate cleanly.
 */
export function useBookmarks() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const update = () => {
      setBookmarkedSlugs(new Set(bookmarksCollection.state.keys()));
    };

    bookmarksCollection.startSyncImmediate();
    update();

    const subscription = bookmarksCollection.subscribeChanges(update);
    return () => subscription.unsubscribe();
  }, []);

  const isBookmarked = (slug: string) => bookmarkedSlugs.has(slug);

  const toggleBookmark = (slug: string) => {
    if (bookmarksCollection.state.get(slug)) {
      bookmarksCollection.delete(slug);
    } else {
      bookmarksCollection.insert({
        slug,
        bookmarkedAt: new Date().toISOString(),
      });
    }
  };

  return { bookmarkedSlugs, isBookmarked, toggleBookmark };
}
