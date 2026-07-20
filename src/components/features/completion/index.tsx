"use client";

import { track } from "@vercel/analytics";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { CheckCircle2Icon } from "@/icons";
import { useProgress } from "@/lib/stores/progress";
import styles from "./styles.module.css";

interface CompletionProps {
  slug: string;
}

/**
 * Article-end completion state: "Mark as complete" progress affordance
 * paired with a "Was this helpful?" feedback widget.
 */
export function Completion({ slug }: CompletionProps) {
  const { isCompleted, toggleCompleted } = useProgress();
  const completed = isCompleted(slug);

  return (
    <div className={styles.completion}>
      <div className={styles.row}>
        <div className={styles.copy}>
          <span className={styles.title} data-completed={completed}>
            {completed ? "Nice work." : "Finished reading?"}
          </span>
          <span className={styles.subtitle}>
            {completed
              ? "This article is marked as complete."
              : "Track your progress through the wiki."}
          </span>
        </div>
        <Button
          variant={completed ? "secondary" : "primary"}
          size="small"
          onClick={() => {
            if (!completed) track("article-completed", { slug });
            toggleCompleted(slug);
          }}
          aria-pressed={completed}
        >
          {completed ? (
            <>
              <CheckCircle2Icon size={14} />
              Completed
            </>
          ) : (
            "Mark as complete"
          )}
        </Button>
      </div>
      <Feedback slug={slug} />
    </div>
  );
}

type FeedbackStatus = "idle" | "note" | "sent";

function Feedback({ slug }: { slug: string }) {
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const [helpful, setHelpful] = useState(true);
  const [note, setNote] = useState("");

  async function submit(vote: boolean, text?: string) {
    setStatus("sent");
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        helpful: vote,
        note: text?.trim() || undefined,
      }),
    }).catch(() => {
      // Feedback is fire-and-forget; losing a submission is acceptable.
    });
  }

  return (
    <div className={styles.feedback}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "idle" && (
          <motion.div
            key="idle"
            className={styles.row}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <span className={styles.subtitle}>Was this helpful?</span>
            <div className={styles.votes}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setHelpful(true);
                  setStatus("note");
                }}
              >
                Yes
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setHelpful(false);
                  setStatus("note");
                }}
              >
                No
              </Button>
            </div>
          </motion.div>
        )}

        {status === "note" && (
          <motion.form
            key="note"
            className={styles.form}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onSubmit={(event) => {
              event.preventDefault();
              submit(helpful, note);
            }}
          >
            <input
              className={styles.input}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                helpful
                  ? "What worked? (optional)"
                  : "What's missing? (optional)"
              }
              maxLength={2000}
              /* biome-ignore lint/a11y/noAutofocus: focus follows an explicit vote click */
              autoFocus
            />
            <Button type="submit" variant="secondary" size="small">
              Send
            </Button>
          </motion.form>
        )}

        {status === "sent" && (
          <motion.span
            key="sent"
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
          >
            Thanks for the feedback.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
