"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface AdminStats {
  totalUsers: number; totalSearches: number; uniqueLocations: number
  avgResults: number; activeUsers: number; blockedUsers: number
  searches7day: { day: string; count: number }[]
  topLocations: { location: string; count: number }[]
  topUsers: { name: string; email: string; count: number }[]
  topCategories: { category: string; count: number }[]
  topOvercrowded: { category: string; count: number }[]
  topRecommendations: { business: string; count: number }[]
}

const kpiCards = [
  { key: "totalUsers", label: "Total User", icon: "group", color: "text-primary" },
  { key: "totalSearches", label: "Pencarian", icon: "search", color: "text-secondary" },
  { key: "uniqueLocations", label: "Lokasi Unik", icon: "pin_drop", color: "text-primary" },
  { key: "avgResults", label: "Rata-rata Usaha", icon: "storefront", color: "text-secondary" },
  { key: "activeUsers", label: "Aktif", icon: "check_circle", color: "text-primary" },
  { key: "blockedUsers", label: "Diblokir", icon: "block", color: "text-destructive" },
]

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(setStats) }, [])

  if (!stats) return (
    <div className="space-y-6">
      <div className="h-8 w-48 shimmer" />
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {[1,2,3,4,5,6].map(i => <Card key={i}><CardContent className="p-5 space-y-2"><div className="h-3 w-16 shimmer" /><div className="h-7 w-12 shimmer" /></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1,2].map(i => <Card key={i}><CardContent className="p-6"><div className="h-[220px] shimmer" /></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <Card key={i}><CardHeader><div className="h-4 w-32 shimmer" /></CardHeader><CardContent className="space-y-2">{[1,2,3,4].map(j => <div key={j} className="h-4 w-full shimmer" />)}</CardContent></Card>)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview aktivitas platform UMKM</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map(c => (
          <Card key={c.key} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-muted-foreground">{c.icon}</span>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
              <p className={`text-2xl font-bold ${c.color}`}>{(stats as any)[c.key]}{c.key === "avgResults" ? "" : ""}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold">📈 Pencarian 7 Hari</CardTitle></CardHeader>
          <CardContent>
            {stats.searches7day?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats.searches7day}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#006a61" strokeWidth={2} dot={{ r: 4, fill: "#006a61" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-10">Belum ada data</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold">🏷️ Kategori Populer</CardTitle></CardHeader>
          <CardContent>
            {stats.topCategories?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.topCategories} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0b1c30" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-10">Belum ada data</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold">📍 Top Lokasi</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.topLocations?.slice(0, 6).map((loc, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0 text-sm">
                <span className="text-muted-foreground">{i + 1}. {loc.location}</span>
                <span className="font-medium">{loc.count}×</span>
              </div>
            ))}
            {!stats.topLocations?.length && <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold">🔥 Overcrowded</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.topOvercrowded?.slice(0, 6).map((o, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0 text-sm">
                <span className="text-destructive">⚠️ {o.category}</span>
                <span className="font-medium">{o.count}×</span>
              </div>
            ))}
            {!stats.topOvercrowded?.length && <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold">💡 Top Rekomendasi AI</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.topRecommendations?.slice(0, 6).map((r, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0 text-sm">
                <span>{["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"][i]} {r.business}</span>
                <span className="font-medium">{r.count}×</span>
              </div>
            ))}
            {!stats.topRecommendations?.length && <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="text-sm font-semibold">👤 User Paling Aktif</CardTitle></CardHeader>
        <CardContent>
          {stats.topUsers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {stats.topUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 border border-border/50">
                  <span className="text-lg">{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.name || u.email}</p>
                    <p className="text-xs text-muted-foreground">{u.count} pencarian</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>}
        </CardContent>
      </Card>
    </div>
  )
}
