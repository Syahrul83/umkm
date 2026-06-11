import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 })
    }

    const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] })
    if (existing.rows.length > 0) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 })
    }

    const password_hash = await hash(password, 10)
    await db.execute({
      sql: "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      args: [name || "", email, password_hash],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}
