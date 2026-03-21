import { NextResponse } from "next/server"

interface GoogleReview {
  name: string
  rating: number
  text: string
  date: string
  photoUrl: string | null
  googleMapsUri: string
}

interface CacheData {
  rating: number
  reviewCount: number
  reviews: GoogleReview[]
  updatedAt: number
  source?: string
}

// Cache in memory — refresh every 24 hours
let cache: CacheData | null = null // cleared on deploy/restart
const CACHE_TTL = 24 * 60 * 60 * 1000

const FALLBACK: CacheData = {
  rating: 4.7,
  reviewCount: 51,
  reviews: [],
  updatedAt: 0,
  source: "fallback",
}

const PLACE_QUERY = "Brenda's Hairstyle Akerstraat-Noord 224 Hoensbroek"

export async function GET() {
  if (cache && Date.now() - cache.updatedAt < CACHE_TTL) {
    return NextResponse.json(cache, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ...FALLBACK, updatedAt: Date.now() },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    )
  }

  try {
    const searchRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.reviews,places.googleMapsUri",
      },
      body: JSON.stringify({ textQuery: PLACE_QUERY }),
    })

    const searchData = await searchRes.json()

    if (!searchData.places?.length) {
      return NextResponse.json(
        { ...FALLBACK, updatedAt: Date.now() },
        { status: 200 }
      )
    }

    const place = searchData.places[0]

    // Filter to 4+ star reviews, use original Dutch text when available, limit to 5
    const reviews: GoogleReview[] = (place.reviews || [])
      .filter((r: { rating: number }) => r.rating >= 4)
      .slice(0, 5)
      .map((r: {
        authorAttribution?: { displayName?: string; photoUri?: string }
        rating: number
        originalText?: { text?: string }
        text?: { text?: string }
        relativePublishTimeDescription?: string
        googleMapsUri?: string
      }) => ({
        name: r.authorAttribution?.displayName || "Anoniem",
        rating: r.rating,
        text: r.originalText?.text || r.text?.text || "",
        date: r.relativePublishTimeDescription || "",
        photoUrl: r.authorAttribution?.photoUri
          ? (r.authorAttribution.photoUri.startsWith("http") ? r.authorAttribution.photoUri : `https:${r.authorAttribution.photoUri}`)
          : null,
        googleMapsUri: r.googleMapsUri || "",
      }))

    cache = {
      rating: place.rating ?? FALLBACK.rating,
      reviewCount: place.userRatingCount ?? FALLBACK.reviewCount,
      reviews,
      updatedAt: Date.now(),
    }

    return NextResponse.json(cache, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    })
  } catch (err) {
    console.error("Google Places API error:", err)
    return NextResponse.json(
      { ...FALLBACK, updatedAt: Date.now() },
      { status: 200 }
    )
  }
}
