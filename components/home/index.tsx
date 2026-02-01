"use client";

import { Field } from "@base-ui/react/field";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { Post } from "@/components/post";
import { BarsThreeIcon, BarsTwo2Icon, MagnifyingGlassIcon } from "@/icons";
import type { FormattedPage } from "@/lib/source";
import { usePreferences } from "@/lib/stores";
import styles from "./styles.module.css";

export function HomeLayout({ pages }: { pages: FormattedPage[] }) {
  const [query, setQuery] = useState("");
  const { viewMode, setViewMode } = usePreferences();

  function handleViewModeChange(value: string[]) {
    if (value.length > 0) {
      setViewMode(value[0] as "card" | "row");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const fuse = useMemo(
    () =>
      new Fuse(pages, {
        keys: ["title", "description", "author.name"],
        threshold: 0.3,
        includeScore: true,
      }),
    [pages],
  );

  const filteredPages = useMemo(() => {
    const q = query.trim();
    const results = q ? fuse.search(q).map((result) => result.item) : pages;

    return [...results].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [fuse, pages, query]);

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces.</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <Field.Root className={styles.search}>
            <MagnifyingGlassIcon className={styles.icon} size={18} />
            <Field.Control
              type="search"
              className={styles.input}
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field.Root>
          <ToggleGroup
            value={[viewMode]}
            className={styles.toggle}
            onValueChange={handleViewModeChange}
          >
            <Toggle value="card" aria-label="Card view" className={styles.view}>
              <BarsThreeIcon size={18} />
            </Toggle>
            <Toggle value="row" aria-label="Row view" className={styles.view}>
              <BarsTwo2Icon size={18} />
            </Toggle>
          </ToggleGroup>
        </div>

        <AnimatePresence mode="wait">
          {filteredPages.length !== 0 && viewMode === "card" && (
            <motion.div
              key="card"
              className={clsx(styles.list, styles.card)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filteredPages.map((page) => (
                <Post.Root key={page.url} page={page} className={styles.post}>
                  <Post.Link>
                    <div className={styles.details}>
                      <Post.Preview />
                      <div>
                        <Post.Title />
                        <Post.Meta>
                          <Post.Author />
                          <Post.Separator />
                          <Post.Date
                            options={{
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }}
                          />
                        </Post.Meta>
                      </div>
                    </div>
                    <div>
                      <Post.Description />
                    </div>
                  </Post.Link>
                </Post.Root>
              ))}
            </motion.div>
          )}

          {filteredPages.length !== 0 && viewMode === "row" && (
            <motion.div
              key="row"
              className={clsx(styles.list, styles.row)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filteredPages.map((page) => (
                <Post.Root key={page.url} page={page} className={styles.post}>
                  <Post.Link>
                    <Post.Date options={{ year: "numeric" }} />
                    <Post.Title as="span" />
                    <Post.Date options={{ day: "2-digit", month: "2-digit" }} />
                  </Post.Link>
                  <Post.Divider />
                </Post.Root>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
