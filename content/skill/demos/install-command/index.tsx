"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Checkmark1Icon, ClipboardIcon } from "@/icons";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

const INSTALL_COMMAND = "npx skills add raphaelsalaja/userinterface-wiki";

const animationProps = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15 },
};

function CopyButton() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    sounds.success();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className={styles["copy-button"]}
      onClick={handleCopy}
      aria-label="Copy install command"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div key="check" {...animationProps}>
            <Checkmark1Icon size={16} />
          </motion.div>
        ) : (
          <motion.div key="copy" {...animationProps}>
            <ClipboardIcon size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function InstallCommand() {
  return (
    <div className={styles.install}>
      <div className={styles["command-container"]}>
        <code className={styles.command}>{INSTALL_COMMAND}</code>
        <CopyButton />
      </div>
      <span className={styles.supported}>
        Supports Claude Code, Codex, Cursor, and more.
      </span>
    </div>
  );
}
