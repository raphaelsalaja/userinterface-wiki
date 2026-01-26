"use client";

import { useCallback, useEffect, useRef } from "react";
import styles from "./styles.module.css";

const image =
  "https://cdn.cosmos.so/104f0bf8-12d0-41f3-841a-cb35db0102b6?format=jpeg";

export function ViewTransitionDemo() {
  const cardRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    const card = cardRef.current;
    const dialog = dialogRef.current;
    if (!card || !dialog) return;

    const sourceImg = card.querySelector("img");
    const clone = card.cloneNode(true) as HTMLElement;
    const dialogImg = clone.querySelector("img");

    if (sourceImg) sourceImg.style.viewTransitionName = "card";

    const run = () => {
      if (sourceImg) sourceImg.style.viewTransitionName = "";
      if (dialogImg) dialogImg.style.viewTransitionName = "card";
      card.setAttribute("aria-expanded", "true");
      dialog.innerHTML = "";
      dialog.append(clone);
      dialog.showModal();
    };

    document.startViewTransition ? document.startViewTransition(run) : run();
  };

  const close = useCallback(() => {
    const card = cardRef.current;
    const dialog = dialogRef.current;
    if (!card || !dialog) return;

    const sourceImg = card.querySelector("img");
    const dialogImg = dialog.querySelector("img");

    if (dialogImg) dialogImg.style.viewTransitionName = "card";

    const run = () => {
      if (dialogImg) dialogImg.style.viewTransitionName = "";
      if (sourceImg) sourceImg.style.viewTransitionName = "card";
      card.removeAttribute("aria-expanded");
      dialog.close();
    };

    const t = document.startViewTransition?.(run);
    if (t) {
      t.finished.then(() => {
        if (sourceImg) sourceImg.style.viewTransitionName = "";
      });
    } else {
      run();
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      close();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [close]);

  return (
    <div className={styles.container}>
      <figure ref={cardRef} className={styles.card}>
        {/* biome-ignore lint/performance/noImgElement: view transitions require native img */}
        <img src={image} alt="" />
        <button type="button" className={styles.button} onClick={open} />
      </figure>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={close}
        onKeyDown={(e) => e.key === "Escape" && close()}
      />
    </div>
  );
}
