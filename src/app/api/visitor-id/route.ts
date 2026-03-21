import { NextRequest, NextResponse } from "next/server"

// Salt ensures the hash can't be reversed to an IP
const SALT = "portfolio-analytics-v1-robin"

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(SALT + ip)
  const hash = await crypto.subtle.digest("SHA-256", data)
  const bytes = new Uint8Array(hash)
  return Array.from(bytes.slice(0, 16))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"

  const visitorId = await hashIP(ip)

  return NextResponse.json(
    { id: visitorId },
    { headers: { "Cache-Control": "private, no-store" } }
  )
}
