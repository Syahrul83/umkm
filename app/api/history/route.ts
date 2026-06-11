import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as any

  const result = await db.execute({
    sql: `SELECT s.id, s.location, s.results_count, s.created_at, 
          COALESCE(sr.recommendations, '[]') as recommendations
          FROM searches s
          LEFT JOIN search_results sr ON sr.search_id = s.id
          WHERE s.user_id = ?
          ORDER BY s.created_at DESC
          LIMIT 50`,
    args: [parseInt(user.id)],
  })

  return NextResponse.json(result.rows)
}
