import { NextRequest, NextResponse } from "next/server"

const SALT = "portfolio-analytics-v1-robin"

async function makeHash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(SALT + input)
  const hash = await crypto.subtle.digest("SHA-256", data)
  const bytes = new Uint8Array(hash)
  return Array.from(bytes.slice(0, 16))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function POST(req: NextRequest) {
  // Client sends a fingerprint (screen, timezone, language)
  // Server combines with IP for a stable anonymous identifier
  const body = await req.json().catch(() => ({}))
  const fingerprint = String(body.fingerprint || "")

  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  const ua = req.headers.get("user-agent") || ""

  // Stable UA: strip version numbers so browser updates don't change the hash
  const stableUA = ua.replace(/\/[\d.]+/g, "").replace(/\s+/g, " ").trim()

  // Hash = IP + browser fingerprint + stable UA
  // Same person, same device = same hash even across IP changes (fingerprint stays)
  // Different person, same IP = different hash (different fingerprint)
  const visitorId = await makeHash(`${ip}|${stableUA}|${fingerprint}`)

  return NextResponse.json(
    { id: visitorId },
    { headers: { "Cache-Control": "private, no-store" } }
  )
}

// Keep GET as fallback
export async function GET(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  const visitorId = await makeHash(ip)

  return NextResponse.json(
    { id: visitorId },
    { headers: { "Cache-Control": "private, no-store" } }
  )
}
