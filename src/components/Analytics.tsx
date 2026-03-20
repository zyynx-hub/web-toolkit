"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase"

/* ------------------------------------------------------------------ */
/*  Lightweight analytics tracker                                      */
/*  - Page views (auto on route change)                                */
/*  - Click events (links, buttons)                                    */
/*  - Time on page                                                     */
/*  - Referrer, screen size, language                                  */
/*  Silent failures — never blocks the UI                              */
/* ------------------------------------------------------------------ */

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  // Use localStorage so same browser = same visitor across tabs/refreshes
  let id = localStorage.getItem("_vid")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("_vid", id)
  }
  return id
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown"
  const w = window.innerWidth
  if (w < 768) return "mobile"
  if (w < 1024) return "tablet"
  return "desktop"
}

async function track(event: string, data: Record<string, unknown> = {}) {
  if (!supabase) return
  if (typeof window !== "undefined" && window.location.hostname === "localhost") return
  try {
    await supabase.from("portfolio_events").insert({
      session_id: getSessionId(),
      event,
      path: window.location.pathname,
      referrer: document.referrer || null,
      device: getDeviceType(),
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      language: navigator.language,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch {
    // Silent fail — analytics should never break the site
  }
}

export default function Analytics() {
  const pathname = usePathname()
  const enteredAt = useRef(Date.now())
  const lastPath = useRef("")

  // Track time on previous page before navigating away
  const trackTimeOnPage = useCallback(() => {
    if (!lastPath.current) return
    const duration = Math.round((Date.now() - enteredAt.current) / 1000)
    if (duration > 0 && duration < 3600) {
      track("time_on_page", { path: lastPath.current, duration_seconds: duration })
    }
  }, [])

  // Page view on route change
  useEffect(() => {
    // Track time on previous page
    if (lastPath.current && lastPath.current !== pathname) {
      trackTimeOnPage()
    }

    // Don't track analytics page itself
    if (pathname === "/analytics") return

    // Track new page view
    enteredAt.current = Date.now()
    lastPath.current = pathname
    track("page_view")
  }, [pathname, trackTimeOnPage])

  // Track time when user leaves the site
  useEffect(() => {
    const handleBeforeUnload = () => trackTimeOnPage()
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [trackTimeOnPage])

  // Track clicks on interactive elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")
      const button = target.closest("button")

      if (anchor) {
        // Get the most specific text: h3 > aria-label > first 30 chars
        const heading = anchor.querySelector("h3")
        const label = heading?.textContent?.trim() || anchor.getAttribute("aria-label") || anchor.textContent?.trim().slice(0, 30)
        track("click", {
          element: "link",
          href: anchor.href,
          text: label,
        })
      } else if (button) {
        track("click", {
          element: "button",
          text: button.textContent?.trim().slice(0, 30),
        })
      }
    }

    document.addEventListener("click", handleClick, { passive: true })
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null // Invisible component
}
