import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const isKVConfigured =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isKVConfigured) {
    return NextResponse.json({ views: 0 });
  }

  const { slug } = await params;
  const views = (await kv.get<number>(`views:${slug}`)) ?? 0;

  return NextResponse.json({ views });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isKVConfigured) {
    return NextResponse.json({ views: 0 });
  }

  const { slug } = await params;
  const views = await kv.incr(`views:${slug}`);

  return NextResponse.json({ views });
}
