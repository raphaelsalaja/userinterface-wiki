"use client";

import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useState } from "react";
import { Button } from "@/components/button";
import { GithubIcon, TwitterIcon } from "@/icons";
import styles from "./styles.module.css";

interface FooterProps {
  slug: string[];
  title: string;
  description: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className={styles.section}>
      <h3 className={styles.label}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function Footer({
  slug,
  title,
  description,
}: FooterProps): React.JSX.Element {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const pathname = usePathname();

  const articleUrl = `https://userinterface.wiki${pathname}`;

  const githubUrl = `https://github.com/raphaelsalaja/userinterface-wiki/blob/main/documents/${slug.join("/")}.mdx`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }, [articleUrl]);

  const handleShareTwitter = useCallback(() => {
    window.open(
      "https://twitter.com/intent/follow?screen_name=raphaelsalaja",
      "_blank",
      "noopener,noreferrer",
    );
  }, []);

  const handleCopyText = useCallback(async () => {
    try {
      const articleElement = document.querySelector("article");
      if (articleElement) {
        const text = articleElement.innerText;
        await navigator.clipboard.writeText(text);
        setIsTextCopied(true);
        setTimeout(() => setIsTextCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, []);

  const handleShareLink = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: articleUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to share:", error);
        }
      }
    } else {
      await handleCopyLink();
    }
  }, [title, description, articleUrl, handleCopyLink]);

  const handleViewGithub = useCallback(() => {
    window.open(githubUrl, "_blank", "noopener,noreferrer");
  }, [githubUrl]);

  const animationProps: React.ComponentProps<typeof motion.div> = {
    initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
    transition: { duration: 0.2 },
  };

  return (
    <div className={styles.footer}>
      <hr className={styles.divider} />
      <div className={styles.metadata}>
        <Section title="Share Article">
          <Button size="small" variant="text" onClick={handleCopyLink}>
            <AnimatePresence mode="wait" initial={false}>
              {isLinkCopied ? (
                <motion.div key="check" {...animationProps}>
                  <CheckIcon size={18} />
                </motion.div>
              ) : (
                <motion.div key="link" {...animationProps}>
                  <LinkIcon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
            Copy Link
          </Button>
          <Button size="small" variant="text" onClick={handleShareTwitter}>
            <TwitterIcon size={18} />X (Twitter)
          </Button>
        </Section>
        <Section title="Resources">
          {" "}
          <Button size="small" variant="text" onClick={handleViewGithub}>
            <GithubIcon size={18} />
            View Github
          </Button>
          <Button size="small" variant="text" onClick={handleCopyText}>
            <AnimatePresence mode="wait" initial={false}>
              {isTextCopied ? (
                <motion.div key="check" {...animationProps}>
                  <CheckIcon size={18} />
                </motion.div>
              ) : (
                <motion.div key="copy" {...animationProps}>
                  <CopyIcon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
            Copy Text
          </Button>
          <Button size="small" variant="text" onClick={handleShareLink}>
            <LinkIcon size={18} />
            Share Link
          </Button>
        </Section>
      </div>
    </div>
  );
}

export default Footer;
