"use client";

import styles from "./styles.module.css";

function Stage() {
  return (
    <section className={styles.stage}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Live demo</span>
        <h1 className={styles.title}>Build something here</h1>
        <p className={styles.subtitle}>
          Empty stage. Replace the marker below with whatever Cursor is asked to
          build.
        </p>
      </header>

      <div className={styles.surface} data-stage>
        {/* CURSOR: replace this comment with the requested UI */}
      </div>
    </section>
  );
}

export { Stage };
