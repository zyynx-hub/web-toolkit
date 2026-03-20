"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

/* ------------------------------------------------------------------ */
/*  Private analytics dashboard — password-protected                   */
/* ------------------------------------------------------------------ */

interface EventRow {
  id: number
  session_id: string
  event: string
  path: string
  referrer: string | null
  device: string
  screen_width: number
  screen_height: number
  language: string
  data: Record<string, unknown>
  timestamp: string
}

interface Stats {
  totalViews: number
  uniqueSessions: number
  topPages: { path: string; count: number }[]
  devices: { device: string; count: number }[]
  recentEvents: EventRow[]
  avgTimeOnPage: number
  clickEvents: { text: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
}

function LoginForm({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("")
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0b" }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(pw) }} className="flex gap-2">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium cursor-pointer">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [authed, setAuthed] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d")

  const handleLogin = useCallback(async (pw: string) => {
    // Check password via API route
    const res = await fetch("/api/analytics-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) {
      setAuthed(true)
      sessionStorage.setItem("_analytics_pw", pw)
    } else {
      setError("Wrong password")
      setTimeout(() => setError(""), 2000)
    }
  }, [])

  // Auto-login from session
  useEffect(() => {
    const saved = sessionStorage.getItem("_analytics_pw")
    if (saved) handleLogin(saved)
  }, [handleLogin])

  // Fetch stats
  useEffect(() => {
    if (!authed || !supabase) return
    setLoading(true)

    const fetchStats = async () => {
      if (!supabase) return
      const since = range === "all" ? "2020-01-01" :
        range === "30d" ? new Date(Date.now() - 30 * 86400000).toISOString() :
        new Date(Date.now() - 7 * 86400000).toISOString()

      const { data: events } = await supabase
        .from("portfolio_events")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", { ascending: false })
        .limit(5000)

      if (!events) { setLoading(false); return }

      const pageViews = events.filter(e => e.event === "page_view")
      const timeEvents = events.filter(e => e.event === "time_on_page")
      const clicks = events.filter(e => e.event === "click")

      // Top pages
      const pageCounts: Record<string, number> = {}
      pageViews.forEach(e => { pageCounts[e.path] = (pageCounts[e.path] || 0) + 1 })
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Devices
      const deviceCounts: Record<string, number> = {}
      pageViews.forEach(e => { deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1 })
      const devices = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count)

      // Unique sessions
      const uniqueSessions = new Set(pageViews.map(e => e.session_id)).size

      // Avg time on page
      const durations = timeEvents
        .map(e => (e.data as { duration_seconds?: number })?.duration_seconds || 0)
        .filter(d => d > 0 && d < 600)
      const avgTimeOnPage = durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0

      // Top clicks
      const clickCounts: Record<string, number> = {}
      clicks.forEach(e => {
        const text = String((e.data as { text?: string })?.text || "unknown")
        clickCounts[text] = (clickCounts[text] || 0) + 1
      })
      const clickEvents = Object.entries(clickCounts)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Views by day
      const dayCounts: Record<string, number> = {}
      pageViews.forEach(e => {
        const day = e.timestamp.split("T")[0]
        dayCounts[day] = (dayCounts[day] || 0) + 1
      })
      const viewsByDay = Object.entries(dayCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setStats({
        totalViews: pageViews.length,
        uniqueSessions,
        topPages,
        devices,
        recentEvents: events.slice(0, 20),
        avgTimeOnPage,
        clickEvents,
        viewsByDay,
      })
      setLoading(false)
    }

    fetchStats()
  }, [authed, range])

  if (!authed) return <LoginForm onLogin={handleLogin} />

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "#0a0a0b", color: "white" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Analytics</h1>
            <p className="text-sm text-white/40 mt-1">robin-portfolio-flax.vercel.app</p>
          </div>
          <div className="flex gap-2">
            {(["7d", "30d", "all"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                style={{
                  background: range === r ? "rgba(255,255,255,0.15)" : "transparent",
                  color: range === r ? "white" : "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        {loading && <div className="text-white/40 text-sm">Loading...</div>}

        {stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Page Views" value={stats.totalViews} />
              <StatCard label="Unique Visitors" value={stats.uniqueSessions} />
              <StatCard label="Avg. Time on Page" value={`${stats.avgTimeOnPage}s`} />
              <StatCard label="Total Interactions" value={stats.clickEvents.reduce((a, b) => a + b.count, 0)} />
            </div>

            {/* Charts row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Views by day — simple bar chart */}
              <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-medium text-white/60 mb-4">Views per Day</h3>
                <div className="flex items-end gap-1 h-32">
                  {stats.viewsByDay.map((d, i) => {
                    const max = Math.max(...stats.viewsByDay.map(v => v.count), 1)
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm transition-all"
                          style={{
                            height: `${(d.count / max) * 100}%`,
                            minHeight: 2,
                            background: "linear-gradient(to top, rgba(249,115,22,0.6), rgba(249,115,22,0.3))",
                          }}
                          title={`${d.date}: ${d.count} views`}
                        />
                        {i % Math.ceil(stats.viewsByDay.length / 7) === 0 && (
                          <span className="text-[9px] text-white/20">{d.date.slice(5)}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Devices */}
              <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-medium text-white/60 mb-4">Devices</h3>
                <div className="space-y-3">
                  {stats.devices.map(d => (
                    <div key={d.device} className="flex items-center gap-3">
                      <span className="text-sm text-white/70 w-16 capitalize">{d.device}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(d.count / stats.totalViews) * 100}%`,
                            background: "rgba(249,115,22,0.5)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-white/40 w-8 text-right">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tables row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Top pages */}
              <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-medium text-white/60 mb-4">Top Pages</h3>
                <div className="space-y-2">
                  {stats.topPages.map(p => (
                    <div key={p.path} className="flex justify-between text-sm">
                      <span className="text-white/70 font-mono text-xs">{p.path}</span>
                      <span className="text-white/40">{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top clicks */}
              <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-medium text-white/60 mb-4">Top Interactions</h3>
                <div className="space-y-2">
                  {stats.clickEvents.map(c => (
                    <div key={c.text} className="flex justify-between text-sm">
                      <span className="text-white/70 truncate mr-4">{c.text}</span>
                      <span className="text-white/40 flex-shrink-0">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent events */}
            <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-sm font-medium text-white/60 mb-4">Recent Events</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/30 text-left">
                      <th className="pb-2 pr-4">Time</th>
                      <th className="pb-2 pr-4">Event</th>
                      <th className="pb-2 pr-4">Page</th>
                      <th className="pb-2 pr-4">Device</th>
                      <th className="pb-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentEvents.map((e, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-2 pr-4 text-white/30 whitespace-nowrap">
                          {new Date(e.timestamp).toLocaleString("nl-NL", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{
                            background: e.event === "page_view" ? "rgba(34,197,94,0.15)" : e.event === "click" ? "rgba(249,115,22,0.15)" : "rgba(139,92,246,0.15)",
                            color: e.event === "page_view" ? "#22C55E" : e.event === "click" ? "#F97316" : "#8B5CF6",
                          }}>
                            {e.event}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-white/50 font-mono">{e.path}</td>
                        <td className="py-2 pr-4 text-white/30 capitalize">{e.device}</td>
                        <td className="py-2 text-white/30 truncate max-w-[200px]">
                          {e.data && Object.keys(e.data).length > 0 ? JSON.stringify(e.data) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
