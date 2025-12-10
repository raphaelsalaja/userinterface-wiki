import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPlainArticleText } from "@/lib/tts/article";
import { buildCacheKey, readFromCache, writeToCache } from "@/lib/tts/cache";
import {
  resolveModelId,
  resolveVoiceId,
  synthesizeSpeech,
} from "@/lib/tts/elevenlabs";
import { ArticleNotFoundError, ResponseError } from "@/lib/tts/errors";
import { toSlugSegments } from "@/lib/tts/slug";

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
    const voiceId = resolveVoiceId(payload.voiceId);
    const modelId = resolveModelId(payload.modelId);

    const cacheKey = buildCacheKey(slugSegments, plainText, voiceId, modelId);

    const cached = await readFromCache(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, hash: cacheKey.hash });
    }

    const synthesized = await synthesizeSpeech(plainText, voiceId, modelId);
    const audioUrl = await writeToCache(cacheKey, synthesized);

    return NextResponse.json({
      audioUrl,
      timestamps: synthesized.timestamps,
      hash: cacheKey.hash,
    });
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
