import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  slug: z.string().min(1).max(200),
  helpful: z.boolean(),
  note: z.string().max(2000).optional(),
});

/**
 * Stores "Was this helpful?" submissions as JSON blobs — no database.
 * Falls back to server logs when blob storage isn't configured (local dev).
 */
export async function POST(request: Request) {
  let payload: z.infer<typeof feedbackSchema>;

  try {
    payload = feedbackSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const entry = {
    ...payload,
    submittedAt: new Date().toISOString(),
  };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(`feedback/${payload.slug}.json`, JSON.stringify(entry), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
  } else {
    console.log("[feedback]", entry);
  }

  return NextResponse.json({ ok: true });
}
