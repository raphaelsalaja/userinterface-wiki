"use client";

import { useRef, useState } from "react";
import { Spinner } from "@/components/primitives/spinner";
import { HeartIcon } from "@/icons";
import styles from "./styles.module.css";

const FAKE_LATENCY = 1200;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RowProps {
  label: string;
  optimistic: boolean;
}

function Row({ label, optimistic }: RowProps) {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const requestId = useRef(0);

  async function toggle() {
    const id = ++requestId.current;
    const next = !liked;

    if (optimistic) {
      setLiked(next);
      await wait(FAKE_LATENCY);
      return;
    }

    setPending(true);
    await wait(FAKE_LATENCY);
    if (id === requestId.current) {
      setLiked(next);
      setPending(false);
    }
  }

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <button
        type="button"
        className={styles.action}
        data-liked={liked}
        onClick={toggle}
        aria-pressed={liked}
        aria-busy={pending}
      >
        {pending ? <Spinner size={14} /> : <HeartIcon size={14} />}
        {liked ? "Liked" : "Like"}
      </button>
    </div>
  );
}

export function OptimisticToggle() {
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <Row label="Waiting" optimistic={false} />
        <Row label="Optimistic" optimistic />
      </div>
    </div>
  );
}
