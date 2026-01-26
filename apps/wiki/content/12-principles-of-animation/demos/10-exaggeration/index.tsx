import styles from "./styles.module.css";

export function Exaggeration() {
  return (
    <div className={styles.container}>
      <video
        autoPlay
        muted
        loop
        playsInline
        src="/content/12-principles-of-animation/videos/exaggeration.mp4"
        style={{
          width: "100%",
          height: 540,
          objectFit: "cover",
        }}
      />
    </div>
  );
}
