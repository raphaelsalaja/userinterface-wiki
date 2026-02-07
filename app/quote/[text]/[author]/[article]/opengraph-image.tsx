import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Quote from userinterface.wiki";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const colors = {
  background: "#fcfcfc",
  text: {
    primary: "#202020",
    secondary: "#838383",
  },
};

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{
    text: string;
    author: string;
    article: string;
  }>;
}) {
  const { text: textBase64, author, article: articleBase64 } = await params;

  const text = decodeBase64Url(textBase64);
  const authorDecoded = decodeURIComponent(author);
  const article = decodeBase64Url(articleBase64);

  const [interSemiBoldData, georgiaData] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/inter/semi-bold.ttf")),
    readFile(join(process.cwd(), "public/fonts/georgia/georgia.ttf")),
  ]);

  const MAX_CHARS = 180;
  const truncatedText =
    text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS).trim()}…` : text;

  return new ImageResponse(
    <div
      style={{
        background: colors.background,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          height: 502,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 24,
            fontWeight: 600,
            color: colors.text.primary,
            letterSpacing: "-0.47px",
          }}
        >
          ui.wiki
        </div>

        <div
          style={{
            display: "flex",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -24,
              top: 8,
              fontFamily: "Georgia",
              fontSize: 48,
              fontWeight: 400,
              color: colors.text.primary,
            }}
          >
            &ldquo;
          </span>
          <span
            style={{
              display: "flex",
              fontFamily: "Georgia",
              fontSize: 48,
              fontWeight: 400,
              color: colors.text.primary,
              letterSpacing: "-0.48px",
              lineHeight: 1.5,
            }}
          >
            {truncatedText}&rdquo;
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 128,
              height: 2,
              backgroundColor: colors.text.primary,
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.47px",
            }}
          >
            <span style={{ color: colors.text.primary }}>
              {authorDecoded},&nbsp;
            </span>
            <span style={{ color: colors.text.secondary }}>{article}</span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interSemiBoldData,
          style: "normal",
          weight: 600,
        },
        {
          name: "Georgia",
          data: georgiaData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
