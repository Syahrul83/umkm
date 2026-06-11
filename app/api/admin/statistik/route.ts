import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const totalSearches = await db.execute("SELECT COUNT(*) as count FROM searches")

  const thisMonth = await db.execute(
    "SELECT COUNT(*) as count FROM searches WHERE created_at > datetime('now', '-30 days')")
  const lastMonth = await db.execute(
    "SELECT COUNT(*) as count FROM searches WHERE created_at > datetime('now', '-60 days') AND created_at <= datetime('now', '-30 days')")

  const thisM = (thisMonth.rows[0] as any).count
  const lastM = (lastMonth.rows[0] as any).count
  const growth = lastM > 0 ? (((thisM - lastM) / lastM) * 100).toFixed(1) : "0"

  const topLocations = await db.execute(
    `SELECT location, COUNT(*) as count FROM searches
     GROUP BY location ORDER BY count DESC LIMIT 5`)

  const locationRows = topLocations.rows as any[]
  const totalLoc = locationRows.reduce((a: number, r: any) => a + r.count, 0) || 1
  const locationDist = locationRows.map((r: any) => ({
    name: r.location,
    count: r.count,
    pct: Math.round((r.count / totalLoc) * 100),
    color: r.location === locationRows[0]?.location ? "#000000" : locationRows.indexOf(r) === 1 ? "#006a61" : "#cbd5e1",
  }))
  const topLocationName = locationRows[0]?.location || "-"

  const searchesByMonth = await db.execute(`
    SELECT substr(created_at, 6, 2) as month, COUNT(*) as count
    FROM searches WHERE created_at > date('now', '-12 months')
    GROUP BY substr(created_at, 6, 2) ORDER BY month`)

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  const monthlyTrend = searchesByMonth.rows.map((r: any) => ({
    month: months[parseInt(r.month) - 1] || r.month,
    count: r.count,
  }))

  const results = await db.execute(
    "SELECT ai_analysis FROM search_results WHERE created_at > datetime('now', '-30 days')")

  const catMap = new Map<string, number>()
  for (const row of results.rows) {
    try {
      const ai = JSON.parse((row as any).ai_analysis || "{}")
      if (ai.stats) for (const s of ai.stats) catMap.set(s.category, (catMap.get(s.category) || 0) + s.count)
    } catch {}
  }
  const topCats = [...catMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const totalCat = topCats.reduce((a, [, c]) => a + c, 0) || 1
  const categoryDist = topCats.map(([category, count]) => ({
    category,
    count,
    pct: Math.round((count / totalCat) * 100),
  }))

  const topCategoryName = categoryDist[0]?.category || "-"
  const topCategoryPct = categoryDist[0]?.pct || 0

  return NextResponse.json({
    totalSearches: (totalSearches.rows[0] as any).count,
    thisMonth: thisM,
    lastMonth: lastM,
    growth: parseFloat(growth),
    topLocationName,
    topCategoryName,
    topCategoryPct,
    locationDist: locationDist,
    monthlyTrend,
    categoryDist,
  })
}
