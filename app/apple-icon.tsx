import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function AppleIcon() {
  const inter = await fetch(
    new URL("../public/fonts/inter/bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        fontSize: 120,
        background: "#111113",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fcfcfc",
        borderRadius: 40,
        fontWeight: 700,
        fontFamily: "Inter",
      }}
    >
      U
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
