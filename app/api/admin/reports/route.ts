import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100)
  const offset = (page - 1) * limit
  const from = url.searchParams.get("from") || ""
  const to = url.searchParams.get("to") || ""
  const userId = url.searchParams.get("user_id") || ""

  const conditions: string[] = []
  const args: any[] = []

  if (from) { conditions.push("s.created_at >= ?"); args.push(from) }
  if (to) { conditions.push("s.created_at <= ?"); args.push(to + " 23:59:59") }
  if (userId) { conditions.push("s.user_id = ?"); args.push(parseInt(userId)) }

  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : ""

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM searches s ${where}`,
    args,
  })
  const total = (countResult.rows[0] as any).total
  const totalPages = Math.ceil(total / limit) || 1

  const result = await db.execute({
    sql: `SELECT s.id, s.location, s.address, s.results_count, s.created_at,
          u.name as user_name, u.email as user_email,
          COALESCE(sr.recommendations, '[]') as recommendations
          FROM searches s
          LEFT JOIN users u ON u.id = s.user_id
          LEFT JOIN search_results sr ON sr.search_id = s.id
          ${where}
          ORDER BY s.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...args, limit, offset],
  })

  const users = await db.execute(
    `SELECT DISTINCT u.id, u.name, u.email FROM users u
     JOIN searches s ON s.user_id = u.id ORDER BY u.email`
  )

  const summary = await db.execute({
    sql: `SELECT COUNT(*) as total, COUNT(DISTINCT s.user_id) as uniqueUsers,
          COALESCE(AVG(s.results_count), 0) as avgResults
          FROM searches s ${where}`,
    args,
  })

  const rows = result.rows.map((r: any) => ({
    ...r,
    recommendations: JSON.parse(r.recommendations || "[]"),
  }))

  return NextResponse.json({
    rows,
    total,
    page,
    totalPages,
    users: users.rows,
    summary: summary.rows[0],
  })
}
