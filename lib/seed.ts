import { db } from "./db"
import { hash } from "bcryptjs"

export async function seed() {
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
    console.log("✅ Admin user created: admin@umkm.com / admin123")
  } else {
    console.log("ℹ️ Admin user already exists")
  }
}
