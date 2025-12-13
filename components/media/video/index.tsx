import Image from "next/image";
import type { VideoHTMLAttributes } from "react";
import PLACEHOLDERS from "./placeholders.json";

interface VideoMetadata {
  placeholder: string;
  aspectRatio: number;
}

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

type PlaceholdersType = Record<string, VideoMetadata>;

export const Video = ({ src, className, style, ...props }: VideoProps) => {
  const placeholders = PLACEHOLDERS as PlaceholdersType;
  const metadata = placeholders[src];
  const aspectRatio = metadata?.aspectRatio || 16 / 9;
  const placeholder = metadata?.placeholder;

  return (
    <div
      style={{
        position: "relative",
        aspectRatio,
        width: "100%",
        ...style,
      }}
    >
      {placeholder && (
        <Image
          aria-hidden="true"
          src={placeholder}
          fill
          unoptimized
          style={{
            objectFit: "cover",
            filter: "blur(32px)",
            scale: "1.2",
            zIndex: 1,
            pointerEvents: "none",
          }}
          alt=""
        />
      )}

      <video
        {...props}
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
        }}
        className={className}
      />
    </div>
  );
};
