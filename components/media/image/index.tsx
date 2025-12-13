import NextImage from "next/image";
import PLACEHOLDERS from "./placeholders.json";

interface ImageMetadata {
  placeholder: string;
  aspectRatio: number;
}

type MediaImageProps = React.ComponentProps<typeof NextImage> & {
  src: string;
};

type PlaceholdersType = Record<string, ImageMetadata>;

export const Image = ({
  src,
  style,
  blurDataURL,
  ...props
}: MediaImageProps) => {
  const placeholders = PLACEHOLDERS as PlaceholdersType;
  const metadata = placeholders[src];

  // Use provided blurDataURL or fallback to generated placeholder
  const placeholder = blurDataURL || metadata?.placeholder;
  const aspectRatio = metadata?.aspectRatio;

  const containerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    ...(aspectRatio && { aspectRatio }),
    ...style,
  };

  return (
    <div style={containerStyle}>
      {placeholder && (
        <NextImage
          aria-hidden="true"
          src={placeholder}
          fill
          unoptimized
          style={{
            objectFit: "cover",
            filter: "blur(4px)",
            scale: "1.5",
            zIndex: 1,
            pointerEvents: "none",
          }}
          alt=""
        />
      )}

      <NextImage
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
      />
    </div>
  );
};
