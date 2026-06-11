import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Run migrations first
    const schema = fs.readFileSync(path.join(process.cwd(), "lib/schema.sql"), "utf-8")
    const statements = schema.split(";").filter((s) => s.trim())
    for (const stmt of statements) {
      await db.execute(stmt)
    }
    // Add address column if missing (for existing databases)
    try {
      await db.execute("ALTER TABLE searches ADD COLUMN address TEXT DEFAULT ''")
    } catch {}
    // Add is_active column if missing
    try {
      await db.execute("ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1")
    } catch {}

    // Seed admin user
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: ["admin@umkm.com"],
    })

    if (existing.rows.length === 0) {
      const password_hash = await hash("admin123", 10)
      await db.execute({
        sql: "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
        args: ["Admin", "admin@umkm.com", password_hash],
      })
    }

    // Seed demo user
    const demoExisting = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: ["user@umkm.com"],
    })

    if (demoExisting.rows.length === 0) {
      const password_hash = await hash("user123", 10)
      await db.execute({
        sql: "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
        args: ["User Demo", "user@umkm.com", password_hash],
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      accounts: [
        { email: "admin@umkm.com", password: "admin123", role: "admin" },
        { email: "user@umkm.com", password: "user123", role: "user" },
      ],
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
