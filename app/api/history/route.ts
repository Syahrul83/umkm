import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as any
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50)
  const offset = (page - 1) * limit

  const countResult = await db.execute({
    sql: "SELECT COUNT(*) as total FROM searches WHERE user_id = ?",
    args: [parseInt(user.id)],
  })
  const total = (countResult.rows[0] as any).total
  const totalPages = Math.ceil(total / limit) || 1

  const result = await db.execute({
    sql: `SELECT s.id, s.location, s.address, s.results_count, s.created_at,
          COALESCE(sr.recommendations, '[]') as recommendations,
          COALESCE(sr.ai_analysis, '{}') as ai_analysis
          FROM searches s
          LEFT JOIN search_results sr ON sr.search_id = s.id
          WHERE s.user_id = ?
          ORDER BY s.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [parseInt(user.id), limit, offset],
  })

  const rows = result.rows.map((r: any) => ({
    ...r,
    user_email: user.email,
    recommendations: JSON.parse(r.recommendations || "[]"),
    analysis: JSON.parse(r.ai_analysis || "{}"),
  }))

  return NextResponse.json({ rows, total, page, totalPages })
}
