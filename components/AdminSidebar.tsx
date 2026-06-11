"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

const navItems = [
  { href: "/admin/overview", label: "Dashboard", icon: "grid_view" },
  { href: "/admin/statistik", label: "Statistik", icon: "bar_chart" },
  { href: "/admin/users", label: "User", icon: "group" },
  { href: "/admin/area-fokus", label: "Area Fokus", icon: "map" },
  { href: "/admin/reports", label: "Laporan", icon: "description" },
  { href: "#", label: "Keluar", icon: "logout", isLogout: true },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-30 bg-white border-r border-border flex flex-col">
      <div className="p-5 border-b border-border">
        <Link href="/admin/overview" className="text-lg font-bold tracking-tight">
          MapIde <span className="text-secondary">UMKM</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">Dashboard Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          if (item.isLogout) {
            return (
              <button
                key={item.label}
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {item.label}
              </button>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
