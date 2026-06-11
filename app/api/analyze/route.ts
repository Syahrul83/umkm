import { NextResponse } from "next/server"
import { askAi } from "@/lib/ai"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { question, location, places } = await req.json()
  const answer = await askAi(question, { location, places })

  return NextResponse.json({ answer })
}
