import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { source } from "@/lib/source";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get("slug");

  if (!slugParam) notFound();

  const slug = slugParam.split("/");
  const page = source.getPage(slug);

  if (!page) notFound();

  const inter = readFileSync(
    join(process.cwd(), "public/fonts/inter/semi-bold.ttf"),
  );

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
          {page.data.title}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
