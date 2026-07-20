"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import styles from "./styles.module.css";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Email capture posting to /api/subscribe. Provider-agnostic — the
 * route handler owns the integration.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Something went wrong. Try again later.");
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setError("Something went wrong. Try again later.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={styles.newsletter}>
        <span className={styles.title}>You're on the list.</span>
        <span className={styles.subtitle}>
          New articles will land in your inbox as they're published.
        </span>
      </div>
    );
  }

  return (
    <div className={styles.newsletter}>
      <div className={styles.copy}>
        <span className={styles.title}>New articles, by email</span>
        <span className={styles.subtitle}>
          Occasional, only when something new is published. No filler.
        </span>
      </div>
      <form className={styles.form} onSubmit={subscribe}>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          autoComplete="email"
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="small"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
