import { NextRequest, NextResponse } from "next/server";

// In-memory rate limit store: IP -> list of timestamps
const rateLimitStore = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) ?? [];

  // Prune expired entries
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (valid.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, valid);
    return true;
  }

  valid.push(now);
  rateLimitStore.set(ip, valid);
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // Extract client IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over 5 minuten opnieuw." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ongeldig verzoek." },
      { status: 400 }
    );
  }

  const { naam, email, bericht } = body as {
    naam?: string;
    email?: string;
    bericht?: string;
  };

  // Validate required fields
  if (!naam || typeof naam !== "string" || naam.trim().length === 0) {
    return NextResponse.json(
      { error: "Naam is verplicht." },
      { status: 400 }
    );
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return NextResponse.json(
      { error: "E-mailadres is verplicht." },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Ongeldig e-mailadres." },
      { status: 400 }
    );
  }

  if (!bericht || typeof bericht !== "string" || bericht.trim().length === 0) {
    return NextResponse.json(
      { error: "Bericht is verplicht." },
      { status: 400 }
    );
  }

  // Log server-side (proof-of-concept; replace with email service later)
  console.log("--- Nieuw contactformulier ---");
  console.log(`Naam:    ${naam.trim()}`);
  console.log(`Email:   ${email.trim()}`);
  console.log(`Bericht: ${bericht.trim()}`);
  console.log(`IP:      ${ip}`);
  console.log(`Tijd:    ${new Date().toISOString()}`);
  console.log("------------------------------");

  return NextResponse.json({ ok: true });
}
