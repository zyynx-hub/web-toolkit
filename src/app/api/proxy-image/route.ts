import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url || !url.startsWith("https://lh3.googleusercontent.com/")) {
    return new NextResponse("Bad request", { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: { "Referer": "" },
    })

    if (!res.ok) {
      return new NextResponse("Not found", { status: 404 })
    }

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "image/jpeg"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
