import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hash } from "bcryptjs"

async function checkAdmin() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") return null
  return user
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50)
  const offset = (page - 1) * limit

  const countResult = await db.execute("SELECT COUNT(*) as total FROM users")
  const total = (countResult.rows[0] as any).total
  const totalPages = Math.ceil(total / limit) || 1

  const result = await db.execute({
    sql: `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at,
           COUNT(s.id) as search_count
           FROM users u
           LEFT JOIN searches s ON s.user_id = u.id
           GROUP BY u.id
           ORDER BY u.created_at DESC
           LIMIT ? OFFSET ?`,
    args: [limit, offset],
  })

  return NextResponse.json({ rows: result.rows, total, page, totalPages })
}

export async function POST(req: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, email, password, role } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 })
  }

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [email],
  })
  if (existing.rows.length > 0) {
    return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 })
  }

  const validRole = role === "admin" ? "admin" : "user"
  const password_hash = await hash(password, 10)
  await db.execute({
    sql: "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    args: [name || "", email, password_hash, validRole],
  })

  return NextResponse.json({ success: true, message: "User berhasil dibuat" })
}
