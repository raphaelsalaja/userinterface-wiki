import styles from "./styles.module.css";

type VideoProps = {
  src: string;
  title?: string;
};

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
  );
  return match?.[1] ?? null;
}

export function Video({ src, title = "Video" }: VideoProps) {
  const youtubeId = getYouTubeId(src);

  if (youtubeId) {
    return (
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* biome-ignore lint/a11y/useMediaCaption: captions not available for embedded videos */}
      <video className={styles.video} controls>
        <source src={src} />
      </video>
    </div>
  );
}
