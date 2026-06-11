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
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COUNT(s.id) as search_count
    FROM users u
    LEFT JOIN searches s ON s.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `)

  return NextResponse.json(result.rows)
}
