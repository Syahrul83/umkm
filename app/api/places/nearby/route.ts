import { NextResponse } from "next/server"
import { searchNearby } from "@/lib/places"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { lat, lng, radius, location, address } = await req.json()
  const user = session.user as any

  const places = await searchNearby(lat, lng, radius)

  const searchResult = await db.execute({
    sql: "INSERT INTO searches (user_id, location, address, lat, lng, radius, results_count) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
    args: [parseInt(user.id), location, address || location, lat, lng, radius, places.length],
  })
  const searchId = searchResult.rows[0]?.id as number

  return NextResponse.json({ places, searchId })
}
