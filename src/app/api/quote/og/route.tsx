import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const textBase64 = searchParams.get("text");
  const author = searchParams.get("author");
  const articleBase64 = searchParams.get("article");

  if (!textBase64 || !author || !articleBase64) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const text = decodeBase64Url(textBase64);
  const authorDecoded = decodeURIComponent(author);
  const article = decodeBase64Url(articleBase64);

  const [interSemiBold, georgia] = await Promise.all([
    fetch(`${origin}/fonts/inter/semi-bold.ttf`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`${origin}/fonts/georgia/georgia.ttf`).then((res) =>
      res.arrayBuffer(),
    ),
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
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "Georgia",
          data: georgia,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
