import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const alt = "ui.wiki - A Living Manual for Better Interfaces.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const interSemiBold = await fetch(
    new URL("../public/fonts/inter/semi-bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        background: "#fcfcfc",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "#202020",
            letterSpacing: "-1.07px",
            lineHeight: 1,
          }}
        >
          ui.wiki
        </div>
        <div
          style={{
            width: 2,
            height: 32,
            background: "#bbb",
          }}
        />
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "#202020",
            letterSpacing: "-1.07px",
            lineHeight: 1,
          }}
        >
          A Living Manual for Better Interfaces.
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
