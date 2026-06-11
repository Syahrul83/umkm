import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const totalUsers = await db.execute("SELECT COUNT(*) as count FROM users")
  const totalSearches = await db.execute("SELECT COUNT(*) as count FROM searches")
  const uniqueLocations = await db.execute("SELECT COUNT(DISTINCT location) as count FROM searches")
  const avgResults = await db.execute("SELECT AVG(results_count) as avg FROM searches")

  const searches7day = await db.execute(`
    SELECT date(created_at) as day, COUNT(*) as count
    FROM searches WHERE created_at > datetime('now', '-7 days')
    GROUP BY date(created_at) ORDER BY day`)

  const topLocations = await db.execute(
    `SELECT location, COUNT(*) as count FROM searches
     GROUP BY location ORDER BY count DESC LIMIT 10`)

  const topUsers = await db.execute(`
    SELECT u.name, u.email, COUNT(s.id) as count
    FROM users u JOIN searches s ON s.user_id = u.id
    GROUP BY u.id ORDER BY count DESC LIMIT 5`)

  const userCount = await db.execute(
    "SELECT is_active, COUNT(*) as count FROM users GROUP BY is_active")

  const results = await db.execute(`
    SELECT ai_analysis, recommendations FROM search_results
    WHERE created_at > datetime('now', '-30 days')
  `)

  const catMap = new Map<string, number>()
  const overMap = new Map<string, number>()
  const recMap = new Map<string, number>()

  for (const row of results.rows) {
    const r = row as any
    try {
      const ai = JSON.parse(r.ai_analysis || "{}")
      if (ai.stats) for (const s of ai.stats) catMap.set(s.category, (catMap.get(s.category) || 0) + s.count)
      if (ai.overcrowded) for (const o of ai.overcrowded) overMap.set(o, (overMap.get(o) || 0) + 1)
    } catch {}
    try {
      const recs = JSON.parse(r.recommendations || "[]")
      if (recs) for (const rec of recs) recMap.set(rec.business, (recMap.get(rec.business) || 0) + 1)
    } catch {}
  }

  const topCategories = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([category, count]) => ({ category, count }))

  const topOvercrowded = [...overMap.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([category, count]) => ({ category, count }))

  const topRecommendations = [...recMap.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([business, count]) => ({ business, count }))

  const activeUsers = (userCount.rows.find((r: any) => r.is_active === 1) as any)?.count || 0
  const blockedUsers = (userCount.rows.find((r: any) => r.is_active === 0) as any)?.count || 0

  return NextResponse.json({
    totalUsers: (totalUsers.rows[0] as any).count,
    totalSearches: (totalSearches.rows[0] as any).count,
    uniqueLocations: (uniqueLocations.rows[0] as any).count,
    avgResults: Math.round(((avgResults.rows[0] as any)?.avg || 0) * 10) / 10,
    activeUsers,
    blockedUsers,
    searches7day: searches7day.rows,
    topLocations: topLocations.rows,
    topUsers: topUsers.rows,
    topCategories,
    topOvercrowded,
    topRecommendations,
  })
}
