"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface AdminStats {
  totalUsers: number
  totalSearches: number
  uniqueLocations: number
  avgResults: number
  activeUsers: number
  blockedUsers: number
  searches7day: { day: string; count: number }[]
  topLocations: { location: string; count: number }[]
  topUsers: { name: string; email: string; count: number }[]
  topCategories: { category: string; count: number }[]
  topOvercrowded: { category: string; count: number }[]
  topRecommendations: { business: string; count: number }[]
}

const cards = [
  { key: "totalUsers", label: "Total User", icon: "👥", color: "text-blue-600", bg: "bg-blue-50" },
  { key: "totalSearches", label: "Total Pencarian", icon: "🔍", color: "text-green-600", bg: "bg-green-50" },
  { key: "uniqueLocations", label: "Lokasi Unik", icon: "📍", color: "text-orange-600", bg: "bg-orange-50" },
  { key: "avgResults", label: "Rata-rata Usaha", icon: "🏪", color: "text-purple-600", bg: "bg-purple-50", suffix: "" },
  { key: "activeUsers", label: "Aktif", icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "blockedUsers", label: "Diblokir", icon: "⛔", color: "text-red-600", bg: "bg-red-50" },
]

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats)
  }, [])

  if (!stats) return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="h-8 w-48 shimmer mb-2" />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}><CardContent className="p-4 space-y-2">
            <div className="h-3 w-16 shimmer" />
            <div className="h-7 w-12 shimmer mt-2" />
          </CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}><CardContent className="p-6"><div className="h-[220px] shimmer" /></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}><CardHeader><div className="h-4 w-32 shimmer" /></CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4].map((j) => <div key={j} className="h-4 w-full shimmer" />)}
          </CardContent></Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {cards.map((c) => (
          <Card key={c.key} className={c.bg}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{c.icon} {c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>
                {(stats as any)[c.key]}{c.suffix || ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">📈 Pencarian 7 Hari Terakhir</CardTitle></CardHeader>
          <CardContent>
            {stats.searches7day?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats.searches7day}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">Belum ada data 7 hari terakhir</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">🏷️ Kategori Paling Dicari</CardTitle></CardHeader>
          <CardContent>
            {stats.topCategories?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.topCategories} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">Belum ada data kategori</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">📍 Top Lokasi</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.topLocations?.map((loc, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b pb-1.5 last:border-0">
                <span className="truncate">{i + 1}. {loc.location}</span>
                <span className="text-gray-500 ml-2 shrink-0">{loc.count}×</span>
              </div>
            ))}
            {!stats.topLocations?.length && <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">🔥 Overcrowded Categories</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.topOvercrowded?.slice(0, 5).map((o, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b pb-1.5 last:border-0">
                <span className="text-red-600">⚠️ {o.category}</span>
                <span className="text-gray-500">{o.count}×</span>
              </div>
            ))}
            {!stats.topOvercrowded?.length && <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">💡 Top Rekomendasi AI</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.topRecommendations?.slice(0, 5).map((r, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b pb-1.5 last:border-0">
                <span>{["🥇", "🥈", "🥉", "4.", "5."][i] || "•"} {r.business}</span>
                <span className="text-gray-500">{r.count}×</span>
              </div>
            ))}
            {!stats.topRecommendations?.length && <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">👤 User Paling Aktif</CardTitle></CardHeader>
        <CardContent>
          {stats.topUsers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {stats.topUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <span className="text-lg">{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.name || u.email}</p>
                    <p className="text-xs text-gray-500">{u.count} pencarian</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>}
        </CardContent>
      </Card>
    </div>
  )
}
