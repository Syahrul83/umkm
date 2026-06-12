import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const user = req.auth?.user as any
  const path = req.nextUrl.pathname

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (path.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/search", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/search/:path*", "/history/:path*", "/admin/:path*"],
}
