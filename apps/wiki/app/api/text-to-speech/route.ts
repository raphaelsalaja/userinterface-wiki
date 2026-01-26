import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ArticleNotFoundError, ResponseError } from "@/lib/errors";
import {
  analyzeParagraphs,
  getPlainArticleText,
  readDocumentFromCache,
} from "@/lib/speech";
import { toSlugSegments } from "@/lib/strings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => ({}));
    const slugSegments = toSlugSegments(payload.slug);

    if (!slugSegments.length) {
      throw new ResponseError("Missing article slug", 400);
    }

    const plainText = await getPlainArticleText(slugSegments);
    const paragraphs = analyzeParagraphs(plainText);

    const cached = await readDocumentFromCache(slugSegments, paragraphs);
    if (cached) {
      return NextResponse.json(cached);
    }

    return NextResponse.json(
      { error: "Narration not pre-generated" },
      { status: 404 },
    );
  } catch (error) {
    if (error instanceof ArticleNotFoundError) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    if (error instanceof ResponseError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("[tts]", error);
    return NextResponse.json(
      { error: "Unable to generate narration" },
      { status: 500 },
    );
  }
}
