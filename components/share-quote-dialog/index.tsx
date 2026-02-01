"use client";

import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownIcon,
  ChainLink1Icon,
  CrossLargeIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/icons";
import { SITE_MANIFEST } from "@/lib/site";
import { sounds } from "@/lib/sounds";
import { Button } from "../button";
import styles from "./styles.module.css";

function encodeBase64Url(str: string) {
  return btoa(String.fromCodePoint(...new TextEncoder().encode(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

interface ShareQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  authorName: string;
  pageTitle: string;
  pageSlug: string;
}

function ShareQuoteDialog({
  open,
  onOpenChange,
  text,
  authorName,
  pageTitle,
  pageSlug,
}: ShareQuoteDialogProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const ogImageUrl = useMemo(() => {
    const textEncoded = encodeBase64Url(text);
    const authorEncoded = encodeURIComponent(authorName);
    const articleEncoded = encodeBase64Url(pageTitle);
    return `/api/quote/og?text=${textEncoded}&author=${authorEncoded}&article=${articleEncoded}`;
  }, [text, authorName, pageTitle]);

  const getShareUrl = useCallback(() => {
    const textEncoded = encodeBase64Url(text);
    const authorEncoded = encodeURIComponent(authorName);
    const articleEncoded = encodeBase64Url(pageTitle);
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : SITE_MANIFEST.url;
    return `${origin}/quote/${textEncoded}/${authorEncoded}/${articleEncoded}?slug=${encodeURIComponent(pageSlug)}`;
  }, [text, authorName, pageTitle, pageSlug]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset loading state when dialog opens or URL changes
  useEffect(() => {
    setImageLoaded(false);
  }, [open, ogImageUrl]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(getShareUrl());
    sounds.success();
  }, [getShareUrl]);

  const handleShareTwitter = useCallback(() => {
    const tweetText = `"${text}" — ${authorName}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(getShareUrl())}`,
      "_blank",
    );
  }, [getShareUrl, text, authorName]);

  const handleShareFacebook = useCallback(() => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
      "_blank",
    );
  }, [getShareUrl]);

  const handleShareLinkedIn = useCallback(() => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
      "_blank",
    );
  }, [getShareUrl]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(ogImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `quote-${pageSlug}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
      sounds.success();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, [ogImageUrl, pageSlug]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
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
                render={
                  <motion.div
                    className={styles.popup}
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.15 }}
                  />
                }
              >
                <div className={styles.header}>
                  <Dialog.Title className={styles.title}>
                    Share Quote
                  </Dialog.Title>
                  <Dialog.Close
                    render={
                      <Button
                        radius="full"
                        aspect="square"
                        variant="ghost"
                        aria-label="Close"
                        onClick={() => onOpenChange(false)}
                      >
                        <CrossLargeIcon size={16} />
                      </Button>
                    }
                  />
                </div>

                <div className={styles.preview}>
                  <AnimatePresence mode="popLayout">
                    {!imageLoaded ? (
                      <motion.div
                        key="skeleton"
                        className={styles.skeleton}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    ) : (
                      // biome-ignore lint: dynamic API image
                      <motion.img
                        key="image"
                        src={ogImageUrl}
                        alt="Quote preview"
                        className={styles.image}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  {/* biome-ignore lint: preload image */}
                  <img
                    src={ogImageUrl}
                    alt=""
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: "none" }}
                  />
                </div>

                <div className={styles.actions}>
                  <Button
                    aspect="square"
                    variant="secondary"
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                  >
                    <ChainLink1Icon size={18} />
                  </Button>
                  <Button
                    aspect="square"
                    variant="secondary"
                    onClick={handleShareTwitter}
                    aria-label="Share on Twitter"
                  >
                    <TwitterIcon size={18} />
                  </Button>
                  <Button
                    aspect="square"
                    variant="secondary"
                    onClick={handleShareFacebook}
                    aria-label="Share on Facebook"
                  >
                    <FacebookIcon size={18} />
                  </Button>
                  <Button
                    aspect="square"
                    variant="secondary"
                    onClick={handleShareLinkedIn}
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </Button>
                  <Button style={{ width: "100%" }} onClick={handleDownload}>
                    <ArrowDownIcon size={16} />
                    Download
                  </Button>
                </div>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export { ShareQuoteDialog };
