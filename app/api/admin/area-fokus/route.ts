import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const topLocations = await db.execute(`
    SELECT location, COUNT(*) as count, ROUND(AVG(results_count), 1) as avg_places
    FROM searches GROUP BY location ORDER BY count DESC LIMIT 5
  `)

  const locations = topLocations.rows as any[]
  const total = locations.reduce((a: number, r: any) => a + r.count, 0) || 1
  const maxCount = locations[0]?.count || 1

  const growthData = await db.execute(`
    SELECT location,
      SUM(CASE WHEN created_at > datetime('now', '-30 days') THEN 1 ELSE 0 END) as recent,
      SUM(CASE WHEN created_at BETWEEN datetime('now', '-60 days') AND datetime('now', '-30 days') THEN 1 ELSE 0 END) as previous
    FROM searches GROUP BY location
  `)

  const growthMap = new Map<string, { recent: number; previous: number }>()
  for (const row of growthData.rows as any[]) {
    growthMap.set(row.location, { recent: row.recent, previous: row.previous || 0 })
  }

  const districts = locations.map((loc: any, i: number) => {
    const growth = growthMap.get(loc.location)
    const recent = growth?.recent || loc.count
    const previous = growth?.previous || 0
    const gPct = previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0
    const pct = Math.round((loc.count / total) * 100)
    return {
      name: loc.location,
      count: loc.count,
      avgPlaces: loc.avg_places,
      pct,
      isDense: pct > 30,
      isGrowing: gPct > 0,
      growthPct: gPct,
      color: i === 0 ? "#000000" : i === 1 ? "#006a61" : "#64748b",
      barColor: pct > 30 ? "bg-destructive" : pct > 15 ? "bg-primary" : "bg-secondary",
      icon: pct > 30 ? "warning" : pct > 15 ? "info" : "auto_awesome",
      status: pct > 30 ? "Sangat Padat" : pct > 15 ? "Normal" : "Potensial",
    }
  })

  const denseDist = districts.filter(d => d.isDense).sort((a, b) => b.pct - a.pct)
  const potentialDist = districts.filter(d => !d.isDense && d.isGrowing).sort((a, b) => b.growthPct - a.growthPct)

  const insight = districts.length > 0
    ? `Berdasarkan data ${districts.length} wilayah yang aktif dicari, **${districts[0]?.name}** merupakan area dengan minat tertinggi (${districts[0]?.pct}% dari total pencarian). ${denseDist.length > 0 ? `Wilayah ${denseDist.map(d => d.name).join(", ")} menunjukkan tingkat kepadatan tinggi. ` : ""}${potentialDist.length > 0 ? `Sementara ${potentialDist[0]?.name} menunjukkan potensi pertumbuhan (+${potentialDist[0]?.growthPct}%).` : "Distribusi pencarian merata di seluruh wilayah."}`
    : "Belum ada data pencarian yang cukup untuk analisis."

  return NextResponse.json({ districts, denseDist, potentialDist, insight })
}
