import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Provider-agnostic newsletter subscription. Currently backed by
 * Buttondown; swap the fetch below to change providers without
 * touching the capture component.
 */
export async function POST(request: Request) {
  let email: string;

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    // No provider configured (local dev / preview) — accept and log so the
    // UI flow can be exercised end to end.
    console.log("[subscribe]", email);
    return NextResponse.json({ ok: true });
  }

  const response = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (response.status === 409 || response.status === 400) {
    // Already subscribed (or provider-side validation) — treat as success,
    // the reader's goal is accomplished either way.
    return NextResponse.json({ ok: true });
  }

  if (!response.ok) {
    console.error("[subscribe] provider error", response.status);
    return NextResponse.json(
      { error: "Something went wrong. Try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
