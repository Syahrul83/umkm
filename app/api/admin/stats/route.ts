import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const totalUsers = await db.execute("SELECT COUNT(*) as count FROM users")
  const totalSearches = await db.execute("SELECT COUNT(*) as count FROM searches")
  const uniqueLocations = await db.execute("SELECT COUNT(DISTINCT location) as count FROM searches")
  const topLocations = await db.execute(
    "SELECT location, COUNT(*) as count FROM searches GROUP BY location ORDER BY count DESC LIMIT 10"
  )

  return NextResponse.json({
    totalUsers: (totalUsers.rows[0] as any).count,
    totalSearches: (totalSearches.rows[0] as any).count,
    uniqueLocations: (uniqueLocations.rows[0] as any).count,
    topLocations: topLocations.rows,
  })
}
