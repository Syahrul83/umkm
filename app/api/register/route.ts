import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ message: "Pendaftaran ditutup — hubungi admin" }, { status: 403 })
}
