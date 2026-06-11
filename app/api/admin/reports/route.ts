import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await db.execute(`
    SELECT s.id, s.location, s.results_count, s.created_at,
           u.name as user_name, u.email as user_email
    FROM searches s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.created_at DESC
    LIMIT 100
  `)

  return NextResponse.json(result.rows)
}
