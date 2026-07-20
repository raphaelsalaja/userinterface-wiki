"use client";

import { useChat } from "@ai-sdk/react";
import { Dialog } from "@base-ui/react/dialog";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "@/components/primitives/spinner";
import { ArrowCornerDownLeftIcon, MagnifyingGlassIcon } from "@/icons";
import { sounds } from "@/lib/sounds";
import { useAskAiStore } from "./store";
import styles from "./styles.module.css";

export interface AskAiPage {
  title: string;
  url: string;
}

interface AskAiDialogProps {
  pages: AskAiPage[];
}

/**
 * Renders assistant text with markdown links and inline code resolved.
 * Full markdown rendering is intentionally out of scope for the palette.
 */
function MarkdownLite({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part.slice(0, 12)}`;

        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const isInternal = href.startsWith("/");
          return isInternal ? (
            <Link key={key} href={href as "/"} className={styles.link}>
              {label}
            </Link>
          ) : (
            <a
              key={key}
              href={href}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          );
        }

        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={key}>{part.slice(1, -1)}</code>;
        }

        return <Fragment key={key}>{part}</Fragment>;
      })}
    </>
  );
}

export function AskAiDialog({ pages }: AskAiDialogProps) {
  const isOpen = useAskAiStore((state) => state.isOpen);
  const close = useAskAiStore((state) => state.close);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"search" | "chat">("search");

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ask" }),
  });

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return pages;
    return pages.filter((page) => page.title.toLowerCase().includes(trimmed));
  }, [pages, query]);

  // Quick-nav rows plus the trailing "Ask AI" row
  const rowCount = matches.length + (query.trim() ? 1 : 0);

  // Reset transient state whenever the palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setMode("search");
      setMessages([]);
    }
  }, [isOpen, setMessages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset selection when the query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: keep the newest message in view while streaming
  useEffect(() => {
    if (mode === "chat") {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [mode, messages]);

  const isBusy = status === "submitted" || status === "streaming";

  function ask(text: string) {
    if (!text.trim() || isBusy) return;
    setMode("chat");
    sendMessage({ text });
    setQuery("");
    sounds.click();
  }

  function navigate(url: string) {
    close();
    sounds.click();
    router.push(url as "/");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (mode === "chat") {
      if (event.key === "Enter") {
        event.preventDefault();
        ask(query);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, rowCount - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex < matches.length) {
        const match = matches[selectedIndex];
        if (match) navigate(match.url);
      } else {
        ask(query);
      }
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal>
            <Dialog.Backdrop
              render={
                <motion.div
                  className={styles.backdrop}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              }
            />
            <Dialog.Viewport className={styles.viewport}>
              <Dialog.Popup
                initialFocus={inputRef}
                render={
                  <motion.div
                    className={styles.popup}
                    initial={{ opacity: 0, scale: 0.98, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  />
                }
              >
                <Dialog.Title className={styles["sr-only"]}>
                  Ask AI
                </Dialog.Title>
                <div className={styles.field}>
                  <MagnifyingGlassIcon size={16} className={styles.icon} />
                  <input
                    ref={inputRef}
                    className={styles.input}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === "chat"
                        ? "Ask a follow-up…"
                        : "Search articles or ask a question…"
                    }
                    aria-label="Search articles or ask a question"
                  />
                  {isBusy && <Spinner size={14} />}
                </div>

                {mode === "search" ? (
                  <div className={styles.results} role="listbox">
                    {matches.map((page, index) => (
                      <button
                        key={page.url}
                        type="button"
                        role="option"
                        aria-selected={index === selectedIndex}
                        className={styles.row}
                        data-selected={index === selectedIndex || undefined}
                        onPointerMove={() => setSelectedIndex(index)}
                        onClick={() => navigate(page.url)}
                      >
                        <span className={styles["row-title"]}>
                          {page.title}
                        </span>
                        <ArrowCornerDownLeftIcon
                          size={14}
                          className={styles["row-hint"]}
                        />
                      </button>
                    ))}
                    {query.trim() && (
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedIndex === matches.length}
                        className={styles.row}
                        data-selected={
                          selectedIndex === matches.length || undefined
                        }
                        onPointerMove={() => setSelectedIndex(matches.length)}
                        onClick={() => ask(query)}
                      >
                        <span className={styles["row-title"]}>
                          Ask AI:&nbsp;
                          <span className={styles["row-query"]}>
                            “{query.trim()}”
                          </span>
                        </span>
                        <ArrowCornerDownLeftIcon
                          size={14}
                          className={styles["row-hint"]}
                        />
                      </button>
                    )}
                    {rowCount === 0 && (
                      <div className={styles.empty}>No matching articles</div>
                    )}
                  </div>
                ) : (
                  <div className={styles.chat} ref={scrollRef}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={styles.message}
                        data-role={message.role}
                      >
                        <p className={styles["message-text"]}>
                          <MarkdownLite
                            text={message.parts
                              .filter(isTextUIPart)
                              .map((part) => part.text)
                              .join("\n\n")}
                          />
                        </p>
                      </div>
                    ))}
                    {status === "submitted" && (
                      <div className={styles.thinking}>
                        <Spinner size={14} />
                        Searching the wiki…
                      </div>
                    )}
                    {status === "error" && (
                      <div className={styles.error}>
                        Something went wrong. Try again.
                      </div>
                    )}
                  </div>
                )}
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
