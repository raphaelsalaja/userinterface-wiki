import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

const colors = {
  background: "#fcfcfc",
  text: {
    primary: "#202020",
    secondary: "#838383",
  },
};

const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "public/fonts/inter/semi-bold.ttf")),
  readFile(join(process.cwd(), "public/fonts/georgia/georgia.ttf")),
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const textBase64 = searchParams.get("text");
  const author = searchParams.get("author");
  const articleBase64 = searchParams.get("article");

  if (!textBase64 || !author || !articleBase64) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const text = Buffer.from(textBase64, "base64url").toString("utf-8");
  const authorDecoded = decodeURIComponent(author);
  const article = Buffer.from(articleBase64, "base64url").toString("utf-8");

  const [interSemiBold, georgia] = await fontsPromise;

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
            {text}&rdquo;
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
