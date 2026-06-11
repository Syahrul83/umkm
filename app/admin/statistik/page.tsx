"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface StatistikData {
  totalSearches: number
  thisMonth: number
  lastMonth: number
  growth: number
  topLocationName: string
  topCategoryName: string
  topCategoryPct: number
  locationDist: { name: string; count: number; pct: number; color: string }[]
  monthlyTrend: { month: string; count: number }[]
  categoryDist: { category: string; count: number; pct: number }[]
}

const circumference = 2 * Math.PI * 40

export default function AdminStatistik() {
  const [data, setData] = useState<StatistikData | null>(null)
  const [range, setRange] = useState("30")

  useEffect(() => {
    fetch("/api/admin/statistik").then(r => r.json()).then(setData)
  }, [])

  const segments = (data?.locationDist || []).map((r) => {
    let offset = 0
    const segs = data!.locationDist.map((d) => {
      const dash = (d.pct / 100) * circumference
      const s = { ...d, dash, offset }
      offset += dash
      return s
    })
    return segs
  })[0] || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistik Pertumbuhan UMKM</h1>
          <p className="text-sm text-muted-foreground">Analisis komprehensif perkembangan bisnis lokal periode ini.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border p-2 rounded-lg shadow-sm">
          <span className="material-symbols-outlined text-muted-foreground text-[18px]">calendar_today</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer outline-none"
          >
            <option value="30">30 Hari Terakhir</option>
            <option value="90">3 Bulan Terakhir</option>
            <option value="365">Tahun Ini</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Pencarian</span>
              <span className="material-symbols-outlined text-[18px] p-1 rounded bg-blue-100 text-blue-700">search</span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{(data?.totalSearches || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Akumulasi seluruh periode</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Bulan Ini</span>
              <span className="material-symbols-outlined text-[18px] p-1 rounded bg-green-100 text-green-700">trending_up</span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{data?.thisMonth || 0}</p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${(data?.growth || 0) > 0 ? "text-secondary" : "text-destructive"}`}>
              <span className="material-symbols-outlined text-[14px]">{(data?.growth || 0) > 0 ? "arrow_upward" : "arrow_downward"}</span>
              {data?.growth || 0}% vs bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Wilayah Teraktif</span>
              <span className="material-symbols-outlined text-[18px] p-1 rounded bg-gray-100 text-gray-700">explore</span>
            </div>
            <p className="text-2xl font-bold tracking-tight truncate">{data?.topLocationName || "-"}</p>
            <p className="text-xs text-muted-foreground mt-2">Paling sering dicari</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Kategori Unggulan</span>
              <span className="material-symbols-outlined text-[18px] p-1 rounded bg-red-100 text-red-700">military_tech</span>
            </div>
            <p className="text-2xl font-bold tracking-tight truncate">{data?.topCategoryName || "-"}</p>
            <p className="text-xs text-muted-foreground mt-2">{data?.topCategoryPct || 0}% dari pencarian</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold">Tren Pencarian UMKM</h3>
              <span className="text-xs text-muted-foreground">Per bulan (12 bulan)</span>
            </div>
            {data?.monthlyTrend?.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.monthlyTrend}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} name="Pencarian" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-10">Belum ada data tahun ini</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-4">Distribusi Wilayah</h3>
            {data?.locationDist?.length ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {segments?.map((s: any, i: number) => (
                      <circle key={i} cx="50" cy="50" r="40" fill="transparent"
                        stroke={s.color} strokeWidth="12" strokeDasharray={s.dash}
                        strokeDashoffset={-s.offset + circumference} className="transition-all duration-500"
                      />
                    ))}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12"
                      strokeDasharray={circumference} strokeDashoffset={0} className="opacity-30" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">{data.locationDist.length}</span>
                    <span className="text-xs text-muted-foreground">Wilayah</span>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {data.locationDist.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        {r.name.length > 12 ? r.name.slice(0, 11) + "…" : r.name}
                      </span>
                      <span className="font-medium">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-10">Belum ada data</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-4">Kategori UMKM Terpopuler</h3>
            {data?.categoryDist?.length ? (
              <div className="space-y-4">
                {data.categoryDist.slice(0, 5).map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{c.category}</span>
                      <span className="font-medium">{c.pct}%</span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-10">Belum ada data</p>}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z' fill='%23000'/%3E%3Ccircle cx='40' cy='40' r='8' fill='%23000'/%3E%3C/svg%3E")`,
              backgroundSize: "120px 120px",
            }}
          />
          <CardContent className="p-5 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">auto_awesome</span>
              <h3 className="text-base font-semibold">Wawasan</h3>
            </div>
            {data ? (
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">search</span>
                  <p><strong>{data.totalSearches}</strong> pencarian telah dilakukan oleh <strong>{data.locationDist.length}</strong> wilayah berbeda.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">trending_up</span>
                  <p>Bulan ini <strong>{data.thisMonth}</strong> pencarian {data.growth > 0 ? `naik ${data.growth}%` : `turun ${Math.abs(data.growth)}%`} dibanding bulan lalu.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">location_on</span>
                  <p>Wilayah <strong>{data.topLocationName}</strong> paling sering dicari — fokus potensi UMKM di area ini.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">category</span>
                  <p>Kategori <strong>{data.topCategoryName}</strong> mendominasi dengan {data.topCategoryPct}% dari total pencarian.</p>
                </li>
              </ul>
            ) : <p className="text-sm text-muted-foreground text-center py-4">Memuat data...</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
