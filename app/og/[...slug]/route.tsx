import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await props.params;
  const page = source.getPage(slug.slice(0, -1));

  if (!page) notFound();

  const fontUrl = new URL("/fonts/inter/semi-bold.ttf", req.url);
  const inter = await fetch(fontUrl).then((res) => res.arrayBuffer());

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

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
