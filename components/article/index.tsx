"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useMemo } from "react";
import { Button } from "@/components/button";
import { Menu } from "@/components/menu";
import { useNarrationContext } from "@/components/narration/provider";
import { Spinner } from "@/components/spinner";
import { TextSelectionPopover } from "@/components/text-selection-popover";
import {
  DotGrid1X3HorizontalIcon,
  PauseIcon,
  PlayIcon,
  VocalMicrophoneIcon,
} from "@/icons";
import type { Author } from "@/lib/authors";
import { getGradientColors } from "@/lib/colors";
import type { SerializablePageData } from "@/lib/page-data";
import { SITE_MANIFEST } from "@/lib/site";
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
      <div className={className}>{children}</div>
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
  const { status, isPlaying, isPlayerVisible, play, pause, showPlayer } =
    useNarrationContext("Header");

  const hasCoauthors = coauthors.length > 0;
  const isLoading = status === "loading";
  const isReady = status === "ready";

  const handleClick = () => {
    if (!isPlayerVisible) {
      showPlayer();
    } else if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const getAriaLabel = () => {
    if (isLoading) return "Loading";
    if (!isPlayerVisible) return "Show player";
    if (isPlaying) return "Pause";
    return "Play";
  };

  const props = {
    button: {
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
            onClick={handleClick}
            disabled={!isReady}
            aria-label={getAriaLabel()}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <Spinner size={16} key="loading" />
              ) : isPlaying ? (
                <motion.div {...ICON_TRANSITION} key="pause">
                  <PauseIcon size={16} />
                </motion.div>
              ) : isPlayerVisible ? (
                <motion.div {...ICON_TRANSITION} key="play">
                  <PlayIcon size={16} />
                </motion.div>
              ) : (
                <motion.div {...ICON_TRANSITION} key="podcast">
                  <VocalMicrophoneIcon size={16} />
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
                  <Menu.RichItem
                    title="Copy Link"
                    description="Copy URL to clipboard"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                  />
                  <Menu.RichItem
                    title="Copy Page"
                    description="Copy page as Markdown for LLMs"
                    onClick={() => {
                      const content = document.querySelector(
                        "[data-article-content]",
                      );
                      if (content) {
                        navigator.clipboard.writeText(
                          content.textContent || "",
                        );
                      }
                    }}
                  />
                  <Menu.Separator />
                  <Menu.RichItem
                    title="View as Markdown"
                    description="View this page as plain text"
                    external
                    onClick={() => {
                      window.open(
                        `${SITE_MANIFEST.github}/blob/main/content/${page.slugs?.join("/")}/index.mdx`,
                        "_blank",
                      );
                    }}
                  />
                  <Menu.Separator />
                  <Menu.RichItem
                    title="Open in ChatGPT"
                    description="Ask ChatGPT about this page"
                    external
                    onClick={() => {
                      window.open(
                        `https://chatgpt.com/?q=${encodeURIComponent(`Read and summarize: ${SITE_MANIFEST.url}${page.url}`)}`,
                        "_blank",
                      );
                    }}
                  />
                  <Menu.RichItem
                    title="Open in Claude"
                    description="Ask Claude about this page"
                    external
                    onClick={() => {
                      window.open(
                        `https://claude.ai/new?q=${encodeURIComponent(`Read and summarize: ${SITE_MANIFEST.url}${page.url}`)}`,
                        "_blank",
                      );
                    }}
                  />
                  <Menu.Separator />
                  <Menu.RichItem
                    title="Report an issue"
                    description="Suggest feedback or report a problem"
                    external
                    onClick={() => {
                      const title = encodeURIComponent(
                        `Feedback: ${page.data.title}`,
                      );
                      const body = encodeURIComponent(
                        `## Page\n[${page.data.title}](${SITE_MANIFEST.url}${page.url})\n\n## Feedback\n\n`,
                      );
                      window.open(
                        `${SITE_MANIFEST.github}/issues/new?title=${title}&body=${body}`,
                        "_blank",
                      );
                    }}
                  />
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
  const { page, author } = useArticleContext("Content");
  const pageSlug = page.slugs?.join("/") ?? "";

  return (
    <article className={className} data-article-content>
      <TextSelectionPopover
        pageTitle={page.data.title}
        pageSlug={pageSlug}
        authorName={author.name}
      >
        {children}
      </TextSelectionPopover>
    </article>
  );
}

export {
  Root as ArticleRoot,
  Header as ArticleHeader,
  Content as ArticleContent,
};
