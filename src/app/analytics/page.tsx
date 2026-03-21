"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
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

const PAGE_NAMES: Record<string, string> = {
  "/": "Homepage",
  "/codex": "Codex",
  "/backrooms": "The Backrooms",
  "/brenda": "Brenda's Hairstyle",
  "/filestudio": "FileStudio",
  "/godotmetrics": "GodotMetrics",
  "/spss": "SPSS-Migratie",
  "/semester6": "Semester 6",
  "/mcp": "MCP Servers",
  "/analytics": "Analytics",
}

function pageName(path: string) {
  return PAGE_NAMES[path] || path
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

function formatReferrer(ref: string | null): string {
  if (!ref) return "Direct"
  try {
    const url = new URL(ref)
    return url.hostname.replace("www.", "")
  } catch {
    return ref.slice(0, 30)
  }
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */
function LoginForm({ onLogin, error }: { onLogin: (pw: string) => void; error: string }) {
  const [pw, setPw] = useState("")
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0b" }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio Analytics</h1>
        <p className="text-sm text-white/30 mb-6">Private dashboard</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(pw) }} className="flex gap-2">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 w-48"
          />
          <button type="submit" className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium cursor-pointer">
            Enter
          </button>
        </form>
        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      </div>
    </div>
  )
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 rounded-xl ${className}`} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <h3 className="text-sm font-medium text-white/50 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  )
}

function Badge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    page_view: { bg: "rgba(34,197,94,0.15)", text: "#22C55E" },
    click: { bg: "rgba(249,115,22,0.15)", text: "#F97316" },
    time_on_page: { bg: "rgba(139,92,246,0.15)", text: "#8B5CF6" },
  }
  const c = colors[type] || { bg: "rgba(255,255,255,0.1)", text: "#999" }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: c.bg, color: c.text }}>
      {type}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */
export default function AnalyticsPage() {
  const [authed, setAuthed] = useState(false)
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d")
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const handleLogin = useCallback(async (pw: string) => {
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

  useEffect(() => {
    const saved = sessionStorage.getItem("_analytics_pw")
    if (saved) handleLogin(saved)
  }, [handleLogin])

  // Fetch raw events
  useEffect(() => {
    if (!authed || !supabase) return
    setLoading(true)

    const fetchData = async () => {
      if (!supabase) return
      const since = range === "all" ? "2020-01-01" :
        range === "30d" ? new Date(Date.now() - 30 * 86400000).toISOString() :
        new Date(Date.now() - 7 * 86400000).toISOString()

      const { data } = await supabase
        .from("portfolio_events")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", { ascending: false })
        .limit(10000)

      setEvents(data || [])
      setLoading(false)
    }
    fetchData()
  }, [authed, range])

  if (!authed) return <LoginForm onLogin={handleLogin} error={error} />

  // Compute all stats from raw events
  const pageViews = events.filter(e => e.event === "page_view")
  const timeEvents = events.filter(e => e.event === "time_on_page")
  const clicks = events.filter(e => e.event === "click")

  const uniqueSessions = new Set(pageViews.map(e => e.session_id)).size

  // Bounce rate — sessions with only 1 page view
  const sessionViewCounts: Record<string, number> = {}
  pageViews.forEach(e => { sessionViewCounts[e.session_id] = (sessionViewCounts[e.session_id] || 0) + 1 })
  const bouncedSessions = Object.values(sessionViewCounts).filter(c => c === 1).length
  const bounceRate = uniqueSessions > 0 ? Math.round((bouncedSessions / uniqueSessions) * 100) : 0

  // Avg time
  const durations = timeEvents
    .map(e => (e.data as { duration_seconds?: number })?.duration_seconds || 0)
    .filter(d => d > 0 && d < 600)
  const avgTime = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0

  // Top pages
  const pageCounts: Record<string, number> = {}
  pageViews.forEach(e => { pageCounts[e.path] = (pageCounts[e.path] || 0) + 1 })
  const topPages = Object.entries(pageCounts).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count)

  // Devices
  const deviceCounts: Record<string, number> = {}
  pageViews.forEach(e => { deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1 })
  const devices = Object.entries(deviceCounts).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count)

  // Referrers
  const refCounts: Record<string, number> = {}
  pageViews.forEach(e => {
    const ref = formatReferrer(e.referrer)
    refCounts[ref] = (refCounts[ref] || 0) + 1
  })
  const referrers = Object.entries(refCounts).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 8)

  // Languages
  const langCounts: Record<string, number> = {}
  pageViews.forEach(e => {
    const lang = e.language?.split("-")[0] || "unknown"
    langCounts[lang] = (langCounts[lang] || 0) + 1
  })
  const languages = Object.entries(langCounts).map(([lang, count]) => ({ lang, count })).sort((a, b) => b.count - a.count)

  // Screen sizes
  const screenCounts: Record<string, number> = {}
  pageViews.forEach(e => {
    const s = `${e.screen_width}x${e.screen_height}`
    screenCounts[s] = (screenCounts[s] || 0) + 1
  })
  const screens = Object.entries(screenCounts).map(([size, count]) => ({ size, count })).sort((a, b) => b.count - a.count).slice(0, 6)

  // Top clicks
  const clickCounts: Record<string, number> = {}
  clicks.forEach(e => {
    const text = String((e.data as { text?: string })?.text || "unknown").slice(0, 40)
    clickCounts[text] = (clickCounts[text] || 0) + 1
  })
  const topClicks = Object.entries(clickCounts).map(([text, count]) => ({ text, count })).sort((a, b) => b.count - a.count).slice(0, 10)

  // Views by day
  const dayCounts: Record<string, number> = {}
  pageViews.forEach(e => { dayCounts[e.timestamp.split("T")[0]] = (dayCounts[e.timestamp.split("T")[0]] || 0) + 1 })
  const viewsByDay = Object.entries(dayCounts).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date))

  // Session list
  const sessionMap: Record<string, EventRow[]> = {}
  events.forEach(e => {
    if (!sessionMap[e.session_id]) sessionMap[e.session_id] = []
    sessionMap[e.session_id].push(e)
  })
  const sessions = Object.entries(sessionMap)
    .map(([id, evts]) => ({
      id,
      events: evts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      device: evts[0]?.device || "unknown",
      language: evts[0]?.language || "unknown",
      referrer: formatReferrer(evts[0]?.referrer),
      startTime: evts[evts.length - 1]?.timestamp || "",
      pageCount: evts.filter(e => e.event === "page_view").length,
      pages: [...new Set(evts.filter(e => e.event === "page_view").map(e => e.path))],
    }))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 20)

  // First page visited per session (entry page)
  const entryPages: Record<string, number> = {}
  sessions.forEach(s => {
    const firstView = s.events.find(e => e.event === "page_view")
    if (firstView) entryPages[firstView.path] = (entryPages[firstView.path] || 0) + 1
  })
  const entryPageList = Object.entries(entryPages).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count)

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#0a0a0b", color: "white" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold">Portfolio Analytics</h1>
            <p className="text-xs text-white/30 mt-0.5">robin-portfolio-flax.vercel.app</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(["7d", "30d", "all"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: range === r ? "rgba(255,255,255,0.12)" : "transparent",
                    color: range === r ? "white" : "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
                </button>
              ))}
            </div>
            {loading && <span className="text-xs text-white/20">Loading...</span>}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard label="Page Views" value={pageViews.length} />
          <StatCard label="Unique Visitors" value={uniqueSessions} />
          <StatCard label="Bounce Rate" value={`${bounceRate}%`} sub={`${bouncedSessions} of ${uniqueSessions} left after 1 page`} />
          <StatCard label="Avg. Time" value={formatDuration(avgTime)} />
          <StatCard label="Interactions" value={clicks.length} />
        </div>

        {/* Row 1: Chart + Devices + Referrers */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Views by day */}
          <Card title="Views per Day">
            {viewsByDay.length === 0 ? (
              <div className="h-28 flex items-center justify-center"><span className="text-xs text-white/20">No data</span></div>
            ) : (
              <div className="flex items-end gap-1.5 h-28">
                {viewsByDay.map((d, i) => {
                  const max = Math.max(...viewsByDay.map(v => v.count), 1)
                  const heightPx = Math.max(8, Math.round((d.count / max) * 100))
                  return (
                    <div
                      key={d.date}
                      className="flex flex-col items-center gap-1"
                      style={{ flex: viewsByDay.length === 1 ? "0 0 40px" : "1" }}
                      title={`${d.date}: ${d.count} views`}
                    >
                      <span className="text-[9px] text-white/40 font-medium">{d.count}</span>
                      <div
                        className="w-full rounded-sm"
                        style={{ height: heightPx, background: "linear-gradient(to top, rgba(249,115,22,0.7), rgba(249,115,22,0.3))" }}
                      />
                      <span className="text-[8px] text-white/20">{d.date.slice(5)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Devices */}
          <Card title="Devices">
            <div className="space-y-3">
              {devices.map(d => (
                <div key={d.device} className="flex items-center gap-3">
                  <span className="text-xs text-white/60 w-14 capitalize">{d.device}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.count / pageViews.length) * 100}%`, background: "rgba(249,115,22,0.5)" }} />
                  </div>
                  <span className="text-[10px] text-white/30 w-6 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Referrers */}
          <Card title="Traffic Sources">
            <div className="space-y-2">
              {referrers.map(r => (
                <div key={r.source} className="flex justify-between text-xs">
                  <span className="text-white/60">{r.source}</span>
                  <span className="text-white/30">{r.count}</span>
                </div>
              ))}
              {referrers.length === 0 && <span className="text-xs text-white/20">No data</span>}
            </div>
          </Card>
        </div>

        {/* Row 2: Pages + Clicks + Entry Pages */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Card title="Top Pages">
            <div className="space-y-2">
              {topPages.map(p => (
                <div key={p.path} className="flex justify-between text-xs">
                  <span className="text-white/60">{pageName(p.path)}</span>
                  <span className="text-white/30">{p.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Top Interactions">
            <div className="space-y-2">
              {topClicks.map(c => (
                <div key={c.text} className="flex justify-between text-xs gap-3">
                  <span className="text-white/60 truncate">{c.text}</span>
                  <span className="text-white/30 flex-shrink-0">{c.count}</span>
                </div>
              ))}
              {topClicks.length === 0 && <span className="text-xs text-white/20">No clicks yet</span>}
            </div>
          </Card>

          <Card title="Entry Pages">
            <div className="space-y-2">
              {entryPageList.map(p => (
                <div key={p.path} className="flex justify-between text-xs">
                  <span className="text-white/60">{pageName(p.path)}</span>
                  <span className="text-white/30">{p.count}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/15 mt-3">First page each visitor landed on</p>
          </Card>
        </div>

        {/* Row 3: Languages + Screens */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="Languages">
            <div className="flex flex-wrap gap-2">
              {languages.map(l => (
                <span key={l.lang} className="px-2.5 py-1 rounded text-[11px]" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                  {l.lang.toUpperCase()} <span className="text-white/25 ml-1">{l.count}</span>
                </span>
              ))}
            </div>
          </Card>

          <Card title="Screen Resolutions">
            <div className="flex flex-wrap gap-2">
              {screens.map(s => (
                <span key={s.size} className="px-2.5 py-1 rounded font-mono text-[11px]" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                  {s.size} <span className="text-white/25 ml-1">{s.count}</span>
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Visitor Sessions */}
        <Card title={`Visitor Sessions (${sessions.length})`} className="mb-6">
          <div className="space-y-1">
            {sessions.map(s => (
              <div key={s.id}>
                <button
                  onClick={() => setSelectedSession(selectedSession === s.id ? null : s.id)}
                  className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left cursor-pointer transition-colors hover:bg-white/5"
                >
                  {/* Device icon */}
                  <span className="text-lg">{s.device === "mobile" ? "📱" : s.device === "tablet" ? "📟" : "🖥"}</span>
                  {/* Time */}
                  <span className="text-[11px] text-white/30 w-24 flex-shrink-0">
                    {new Date(s.startTime).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {/* Pages visited */}
                  <div className="flex-1 flex flex-wrap gap-1">
                    {s.pages.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded text-[10px]" style={{ background: "rgba(249,115,22,0.1)", color: "rgba(249,115,22,0.7)" }}>
                        {pageName(p)}
                      </span>
                    ))}
                  </div>
                  {/* Meta */}
                  <span className="text-[10px] text-white/20 flex-shrink-0">{s.referrer}</span>
                  <span className="text-[10px] text-white/20 flex-shrink-0 w-6">{s.language.split("-")[0]}</span>
                  <span className="text-[10px] text-white/15">{selectedSession === s.id ? "▲" : "▼"}</span>
                </button>

                {/* Expanded timeline */}
                {selectedSession === s.id && (
                  <div className="ml-12 pl-4 mb-3 space-y-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                    {s.events.map((e, i) => (
                      <div key={i} className="flex items-center gap-3 py-1 text-[11px]">
                        <span className="text-white/20 w-12 flex-shrink-0">
                          {new Date(e.timestamp).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                        <Badge type={e.event} />
                        <span className="text-white/40">{pageName(e.path)}</span>
                        {e.event === "click" && (
                          <span className="text-white/25 truncate">→ {String((e.data as { text?: string })?.text || "").slice(0, 30)}</span>
                        )}
                        {e.event === "time_on_page" && (
                          <span className="text-white/25">{(e.data as { duration_seconds?: number })?.duration_seconds}s</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sessions.length === 0 && <p className="text-xs text-white/20 py-4 text-center">No sessions yet</p>}
          </div>
        </Card>

        {/* Recent Events */}
        <Card title="Recent Events (raw)">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-white/25 text-left">
                  <th className="pb-2 pr-3 font-medium">Time</th>
                  <th className="pb-2 pr-3 font-medium">Event</th>
                  <th className="pb-2 pr-3 font-medium">Page</th>
                  <th className="pb-2 pr-3 font-medium">Device</th>
                  <th className="pb-2 pr-3 font-medium">Referrer</th>
                  <th className="pb-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 30).map((e, i) => (
                  <tr key={i} className="border-t border-white/[0.03]">
                    <td className="py-1.5 pr-3 text-white/25 whitespace-nowrap">
                      {new Date(e.timestamp).toLocaleString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit", day: "numeric", month: "short" })}
                    </td>
                    <td className="py-1.5 pr-3"><Badge type={e.event} /></td>
                    <td className="py-1.5 pr-3 text-white/40">{pageName(e.path)}</td>
                    <td className="py-1.5 pr-3 text-white/25 capitalize">{e.device}</td>
                    <td className="py-1.5 pr-3 text-white/20">{formatReferrer(e.referrer)}</td>
                    <td className="py-1.5 text-white/20 truncate max-w-[200px]">
                      {e.data && Object.keys(e.data).length > 0 ? JSON.stringify(e.data) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
