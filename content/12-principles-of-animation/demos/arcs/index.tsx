import styles from "./styles.module.css";

export function Arcs() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      src="/content/12-principles-of-animation/videos/arcs.mp4"
      className={styles.video}
    />
  );
}
