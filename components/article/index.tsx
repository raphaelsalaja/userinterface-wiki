"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useMemo, useRef } from "react";
import { Button } from "@/components/button";
import { Menu } from "@/components/menu";
import { useNarrationContext } from "@/components/narration/provider";
import { DotGrid1X3HorizontalIcon, PauseIcon, PlayIcon } from "@/icons";
import type { Author } from "@/lib/authors";
import { getGradientColors } from "@/lib/colors";
import type { SerializablePageData } from "@/lib/page-data";
import styles from "./styles.module.css";

export type { SerializablePageData } from "@/lib/page-data";

export interface ArticleContextValue {
  page: SerializablePageData;
  author: Author;
  coauthors: Author[];
  colors: [string, string];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ArticleContext = createContext<ArticleContextValue | null>(null);

function useArticleContext(componentName: string): ArticleContextValue {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error(
      `<Article.${componentName}> must be used within <Article.Root>`,
    );
  }
  return context;
}

export function useArticle(): ArticleContextValue {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticle must be used within <Article.Root>");
  }
  return context;
}

interface RootProps {
  data: SerializablePageData;
  author: Author;
  coauthors?: Author[];
  children: React.ReactNode;
  className?: string;
}

function Root({
  data: page,
  author,
  coauthors = [],
  children,
  className,
}: RootProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const colors = useMemo(
    () => getGradientColors(page.slugs?.join("-") ?? ""),
    [page.slugs],
  );

  const contextValue: ArticleContextValue = useMemo(
    () => ({
      page,
      colors,
      author,
      coauthors,
    }),
    [page, colors, author, coauthors],
  );

  return (
    <ArticleContext.Provider value={contextValue}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </ArticleContext.Provider>
  );
}

const ICON_TRANSITION = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  transition: { duration: 0.15 },
} as const;

interface HeaderProps {
  className?: string;
}

function Header({ className }: HeaderProps) {
  const { page, author, coauthors } = useArticleContext("Header");
  const { status, isPlaying, toggle, showPlayer } =
    useNarrationContext("Header");

  const hasCoauthors = coauthors.length > 0;
  const isReady = status === "ready";

  const handlePlayClick = () => {
    toggle();
    showPlayer();
  };

  const props = {
    button: {
      variant: "ghost",
      aspect: "square",
      radius: "full",
      className: styles.button,
    } as const,
  };

  return (
    <div className={clsx(styles.header, className)}>
      <div className={styles.row}>
        <h1 className={styles.title}>{page.data.title}</h1>
        <div className={styles.actions}>
          <Button
            {...props.button}
            onClick={handlePlayClick}
            disabled={!isReady}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div {...ICON_TRANSITION} key="pause">
                  <PauseIcon size={16} />
                </motion.div>
              ) : (
                <motion.div {...ICON_TRANSITION} key="play">
                  <PlayIcon size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Menu.Root>
            <Menu.Trigger
              render={
                <Button
                  {...props.button}
                  className={styles.button}
                  aria-label="Menu"
                >
                  <DotGrid1X3HorizontalIcon size={16} />
                </Button>
              }
            />
            <Menu.Portal>
              <Menu.Positioner sideOffset={8} align="end" side="bottom">
                <Menu.Popup>
                  <Menu.Item>Copy Link</Menu.Item>
                  <Menu.Item>Share</Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </div>
      <div className={styles.metadata}>
        {formatDate(page.data.date)}&nbsp;by&nbsp;
        {author.name}
        {hasCoauthors && <span>&nbsp;and {coauthors.length} others</span>}
      </div>
    </div>
  );
}

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

function Content({ children, className }: ContentProps) {
  return (
    <article className={className} data-article-content>
      {children}
    </article>
  );
}

export {
  Root as ArticleRoot,
  Header as ArticleHeader,
  Content as ArticleContent,
};
