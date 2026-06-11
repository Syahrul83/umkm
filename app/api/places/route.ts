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

  const { lat, lng, radius, location } = await req.json()
  const user = session.user as any

  const places = await searchNearby(lat, lng, radius)
  const analysis = await analyzePlaces(places, location)

  const searchResult = await db.execute({
    sql: "INSERT INTO searches (user_id, location, lat, lng, radius, results_count) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    args: [parseInt(user.id), location, lat, lng, radius, places.length],
  })
  const searchId = searchResult.rows[0]?.id as number

  await db.execute({
    sql: "INSERT INTO search_results (search_id, raw_places, ai_analysis, recommendations) VALUES (?, ?, ?, ?)",
    args: [
      searchId,
      JSON.stringify(places),
      JSON.stringify(analysis),
      JSON.stringify(analysis.recommendations),
    ],
  })

  return NextResponse.json({ places, analysis })
}
