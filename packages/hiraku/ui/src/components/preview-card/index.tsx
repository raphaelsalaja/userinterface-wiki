import type { OGMetadata } from "../../types";
import styles from "./styles.module.css";

interface PreviewCardProps {
  platform: string;
  metadata: OGMetadata;
  url: string;
}

export function PreviewCard({ platform, metadata, url }: PreviewCardProps) {
  const title = metadata.og.title || metadata.basic.title || "No title";
  const description =
    metadata.og.description || metadata.basic.description || "No description";
  const image = metadata.og.image;
  const displayUrl = metadata.og.url || url;

  return (
    <div className={styles.card}>
      <div className={styles.platform}>{platform}</div>
      <div className={styles.image}>
        {image ? <img src={image} alt="" /> : "No image"}
      </div>
      <div className={styles.body}>
        <div className={styles.url}>{displayUrl}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}
