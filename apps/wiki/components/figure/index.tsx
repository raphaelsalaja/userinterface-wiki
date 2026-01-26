"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { ArrowInboxIcon, Checkmark1Icon, ClipboardIcon } from "@/icons";
import styles from "./styles.module.css";
import { getRenderablePngBlob } from "./utils";

type FigureProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  downloadable?: boolean;
};

const animationProps: React.ComponentProps<typeof motion.div> = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  transition: { duration: 0.2 },
};

export function Figure({
  children,
  className,
  downloadable = false,
  ...props
}: FigureProps) {
  const figureRef = React.useRef<HTMLElement | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState<
    "copy" | "download" | null
  >(null);
  const [hasRenderableContent, setHasRenderableContent] = React.useState(false);

  React.useEffect(() => {
    if (!isCopied) return undefined;
    const timeoutId = window.setTimeout(() => setIsCopied(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  React.useEffect(() => {
    if (!isDownloaded) return undefined;
    const timeoutId = window.setTimeout(() => setIsDownloaded(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [isDownloaded]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: rerun when figure children change
  React.useEffect(() => {
    const node = figureRef.current;
    if (!node) return;
    const hasImg = Boolean(node.querySelector("img"));
    const hasSvg = Boolean(node.querySelector("svg"));
    setHasRenderableContent(hasImg || hasSvg);
  }, [children]);

  const copyAsPng = React.useCallback(async () => {
    setIsCopied(false);
    setIsProcessing("copy");
    try {
      const node = figureRef.current;
      if (!node) throw new Error("No figure node found.");

      const blob = await getRenderablePngBlob(node);

      if (
        navigator.clipboard &&
        "write" in navigator.clipboard &&
        "ClipboardItem" in window
      ) {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        setIsCopied(true);
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "figure.png";
        link.click();
        URL.revokeObjectURL(url);
        setIsCopied(true);
      }
    } catch (error) {
      console.error("Failed to copy PNG", error);
    } finally {
      setIsProcessing(null);
    }
  }, []);

  const downloadPng = React.useCallback(async () => {
    setIsDownloaded(false);
    setIsProcessing("download");
    try {
      const node = figureRef.current;
      if (!node) throw new Error("No figure node found.");

      const blob = await getRenderablePngBlob(node);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "figure.png";
      link.click();
      URL.revokeObjectURL(url);
      setIsDownloaded(true);
    } catch (error) {
      console.error("Failed to download PNG", error);
    } finally {
      setIsProcessing(null);
    }
  }, []);

  const isBusy = Boolean(isProcessing);

  return (
    <figure
      ref={figureRef}
      data-prose-type="figure"
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
      {downloadable && (
        <div
          className={styles.toolbar}
          aria-hidden={!hasRenderableContent}
          data-figure-toolbar="true"
        >
          <button
            type="button"
            className={styles.button}
            onClick={copyAsPng}
            disabled={!hasRenderableContent || isBusy}
            aria-label="Copy figure as PNG"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.div key="check" {...animationProps}>
                  <Checkmark1Icon />
                </motion.div>
              ) : (
                <motion.div key="link" {...animationProps}>
                  <ClipboardIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={downloadPng}
            disabled={!hasRenderableContent || isBusy}
            aria-label="Download figure as PNG"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDownloaded ? (
                <motion.div key="check" {...animationProps}>
                  <Checkmark1Icon />
                </motion.div>
              ) : (
                <motion.div key="download" {...animationProps}>
                  <ArrowInboxIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}
    </figure>
  );
}

export function Caption({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <figcaption
      data-prose-type="figcaption"
      className={[styles.caption, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
