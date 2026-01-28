"use client";

import { useTextSelection } from "ahooks";
import { AnimatePresence, motion } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ShareQuoteDialog } from "@/components/share-quote-dialog";
import { SITE_MANIFEST } from "@/lib/site";
import styles from "./styles.module.css";

interface TextSelectionPopoverProps {
  children: ReactNode;
  pageTitle: string;
  pageSlug: string;
  authorName: string;
}

function TextSelectionPopover({
  children,
  pageTitle,
  pageSlug,
  authorName,
}: TextSelectionPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [, forceUpdate] = useState(0);

  const { text, top, left, right } = useTextSelection(containerRef);
  const hasFullWord = text.trim().split(/\s+/).filter(Boolean).length >= 1;
  const hasValidSelection = hasFullWord && !Number.isNaN(top);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey || e.key === "Shift") {
        forceUpdate((n) => n + 1);
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, []);

  const handleClose = useCallback(() => {
    window.getSelection()?.removeAllRanges();
  }, []);

  const handleShareQuote = useCallback(() => {
    if (!text) return;
    setSelectedText(text);
    setDialogOpen(true);
    handleClose();
  }, [text, handleClose]);

  const handleReportIssue = useCallback(() => {
    if (!text) return;

    const title = encodeURIComponent(`Feedback: ${pageTitle}`);
    const body = encodeURIComponent(
      `## Page\n[${pageTitle}](${SITE_MANIFEST.url}/${pageSlug})\n\n## Selected Text\n> ${text}\n\n## Issue\n\n`,
    );

    window.open(
      `${SITE_MANIFEST.github}/issues/new?title=${title}&body=${body}`,
      "_blank",
    );
    handleClose();
  }, [text, pageTitle, pageSlug, handleClose]);

  const popoverStyle: CSSProperties = hasValidSelection
    ? {
        position: "fixed",
        left: `${left + (right - left) / 2}px`,
        top: `${top - 48}px`,
        transform: "translateX(-50%)",
        transformOrigin: "center top",
      }
    : { position: "fixed", visibility: "hidden" };

  return (
    <>
      <div ref={containerRef}>{children}</div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {hasValidSelection && (
              <motion.div
                className={styles.popover}
                style={popoverStyle}
                initial={{ opacity: 0, x: "-50%", y: 4, scale: 0.96 }}
                animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                exit={{ opacity: 0, x: "-50%", y: 4, scale: 0.96 }}
                transition={{ duration: 0.12, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className={styles.popup}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={handleShareQuote}
                    aria-label="Share Quote"
                  >
                    Share Quote
                  </button>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={handleReportIssue}
                    aria-label="Report Issue"
                  >
                    Report Issue
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <ShareQuoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        text={selectedText}
        authorName={authorName}
        pageTitle={pageTitle}
        pageSlug={pageSlug}
      />
    </>
  );
}

export { TextSelectionPopover };
