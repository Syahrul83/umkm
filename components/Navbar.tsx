"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between bg-white">
      <Link href="/search" className="font-bold text-xl">
        MapIde <span className="text-secondary">UMKM</span>
      </Link>
      <div className="flex items-center gap-4">
        {user?.role === "admin" ? (
          <>
            <Link href="/admin/overview" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
              <span className="material-symbols-outlined text-[16px]">group</span>
              User
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
              <span className="material-symbols-outlined text-[16px]">description</span>
              Laporan
            </Link>
          </>
        ) : (
          <>
            <Link href="/search" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
              <span className="material-symbols-outlined text-[16px]">search</span>
              Cari
            </Link>
            <Link href="/history" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
              <span className="material-symbols-outlined text-[16px]">history</span>
              Riwayat
            </Link>
          </>
        )}
        <span className="text-sm text-gray-500">{user?.name || user?.email}</span>
        <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5" onClick={() => signOut()}>
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Keluar
        </Button>
      </div>
    </nav>
  )
}
