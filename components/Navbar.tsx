"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between bg-white">
      <Link href="/search" className="font-bold text-xl text-blue-700">MapIde UMKM</Link>
      <div className="flex items-center gap-4">
        {user?.role === "admin" ? (
          <>
            <Link href="/admin/overview" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link href="/admin/users" className="text-sm text-gray-600 hover:text-blue-600">User</Link>
            <Link href="/admin/reports" className="text-sm text-gray-600 hover:text-blue-600">Laporan</Link>
          </>
        ) : (
          <>
            <Link href="/search" className="text-sm text-gray-600 hover:text-blue-600">Cari</Link>
            <Link href="/history" className="text-sm text-gray-600 hover:text-blue-600">Riwayat</Link>
          </>
        )}
        <span className="text-sm text-gray-500">{user?.name || user?.email}</span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>Keluar</Button>
      </div>
    </nav>
  )
}
