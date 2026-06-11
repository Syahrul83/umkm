import { db } from "./db"
import fs from "fs"
import path from "path"

export async function initDb() {
  const schema = fs.readFileSync(path.join(process.cwd(), "lib/schema.sql"), "utf-8")
  const statements = schema.split(";").filter(s => s.trim())
  for (const stmt of statements) {
    await db.execute(stmt)
  }
}
