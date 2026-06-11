import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { hash } from "bcryptjs"

async function checkAdmin() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") return null
  return user
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { name, email, password, role } = await req.json()

  const existing = await db.execute({ sql: "SELECT id FROM users WHERE id = ?", args: [parseInt(id)] })
  if (existing.rows.length === 0) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
  }

  if (email) {
    const dup = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? AND id != ?",
      args: [email, parseInt(id)],
    })
    if (dup.rows.length > 0) {
      return NextResponse.json({ message: "Email sudah digunakan user lain" }, { status: 400 })
    }
  }

  const validRole = role === "admin" ? "admin" : "user"
  const updates: string[] = ["name = ?", "email = ?", "role = ?"]
  const vals: any[] = [name || "", email, validRole]

  if (password) {
    updates.push("password_hash = ?")
    vals.push(await hash(password, 10))
  }

  vals.push(parseInt(id))
  await db.execute({
    sql: `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
    args: vals,
  })

  return NextResponse.json({ success: true, message: "User berhasil diupdate" })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const userId = parseInt(id)

  if (userId === parseInt(admin.id)) {
    return NextResponse.json({ message: "Tidak bisa memblokir akun sendiri" }, { status: 400 })
  }

  const existing = await db.execute({ sql: "SELECT id, is_active FROM users WHERE id = ?", args: [userId] })
  if (existing.rows.length === 0) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
  }

  const current = (existing.rows[0] as any).is_active
  const newStatus = current ? 0 : 1

  await db.execute({
    sql: "UPDATE users SET is_active = ? WHERE id = ?",
    args: [newStatus, userId],
  })

  return NextResponse.json({
    success: true,
    is_active: newStatus,
    message: newStatus ? "User diaktifkan" : "User diblokir",
  })
}
