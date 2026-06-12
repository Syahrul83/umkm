import { NextResponse } from "next/server"
import { searchNearby } from "@/lib/places"
import { analyzePlaces } from "@/lib/ai"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { lat, lng, radius, location, address, skipNearby, searchId, places: clientPlaces } = body
  const user = session.user as any

  // Mode 1: Full search (nearby + AI)
  if (!skipNearby) {
    const latRounded = Math.round(lat * 1000) / 1000
    const lngRounded = Math.round(lng * 1000) / 1000

    const cached = await db.execute({
      sql: `SELECT sr.raw_places, sr.ai_analysis, sr.recommendations
            FROM search_results sr
            JOIN searches s ON s.id = sr.search_id
            WHERE ROUND(s.lat, 3) = ? AND ROUND(s.lng, 3) = ? AND s.radius = ?
            AND s.created_at > datetime('now', '-24 hours')
            ORDER BY s.created_at DESC LIMIT 1`,
      args: [latRounded, lngRounded, radius],
    })

    if (cached.rows[0]) {
      const row = cached.rows[0] as any
      return NextResponse.json({
        places: JSON.parse(row.raw_places),
        analysis: JSON.parse(row.ai_analysis),
        cached: true,
      })
    }

    const places = await searchNearby(lat, lng, radius)
    const analysis = await analyzePlaces(places, location)

    const searchResult = await db.execute({
      sql: "INSERT INTO searches (user_id, location, address, lat, lng, radius, results_count) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
      args: [parseInt(user.id), location, address || location, lat, lng, radius, places.length],
    })
    const sId = searchResult.rows[0]?.id as number

    await db.execute({
      sql: "INSERT INTO search_results (search_id, raw_places, ai_analysis, recommendations) VALUES (?, ?, ?, ?)",
      args: [sId, JSON.stringify(places), JSON.stringify(analysis), JSON.stringify(analysis.recommendations)],
    })

    return NextResponse.json({ places, analysis, cached: false })
  }

  // Mode 2: AI only (nearby already called)
  if (!searchId || !clientPlaces) {
    return NextResponse.json({ error: "searchId and places required" }, { status: 400 })
  }

  const analysis = await analyzePlaces(clientPlaces, location)

  await db.execute({
    sql: "INSERT INTO search_results (search_id, raw_places, ai_analysis, recommendations) VALUES (?, ?, ?, ?)",
    args: [searchId, JSON.stringify(clientPlaces), JSON.stringify(analysis), JSON.stringify(analysis.recommendations)],
  })

  return NextResponse.json({ analysis })
}
