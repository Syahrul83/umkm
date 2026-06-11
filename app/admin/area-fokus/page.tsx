"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface District {
  name: string; count: number; avgPlaces: number; pct: number
  isDense: boolean; isGrowing: boolean; growthPct: number
  color: string; barColor: string; icon: string; status: string
}

interface AreaData {
  districts: District[]
  denseDist: District[]
  potentialDist: District[]
  insight: string
}

export default function AdminAreaFokus() {
  const [data, setData] = useState<AreaData | null>(null)

  useEffect(() => {
    fetch("/api/admin/area-fokus").then(r => r.json()).then(setData)
  }, [])

  const dense = data?.denseDist?.[0]
  const potential = data?.potentialDist?.[0]
  const districts = data?.districts || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analisis Area Fokus</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Distribusi pencarian UMKM berdasarkan wilayah — data real dari {data?.districts.length || 0} lokasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[500px] rounded-xl overflow-hidden shadow-sm border border-border relative bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }} />
            <div className="absolute inset-0 bg-primary/5" />
            {districts.map((d, i) => {
              const posX = 25 + (i * 15)
              const posY = 30 + (i % 3) * 18
              const size = 8 + Math.min(d.pct, 50)
              const isTop = i === 0
              return (
                <div key={i} className="absolute group cursor-pointer"
                  style={{ top: `${posY}%`, left: `${posX}%` }}>
                  <div className={`${isTop ? "bg-destructive/30" : d.isDense ? "bg-destructive/20" : d.isGrowing ? "bg-secondary/20" : "bg-primary/10"} rounded-full flex items-center justify-center`}
                    style={{ width: size * 2, height: size * 2 }}>
                    <div className={`${isTop ? "bg-destructive" : d.isDense ? "bg-destructive" : d.isGrowing ? "bg-secondary" : "bg-primary"} rounded-full border-2 border-white shadow-lg`}
                      style={{ width: size > 20 ? 16 : 10, height: size > 20 ? 16 : 10 }} />
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                    {d.name}: {d.count} pencarian
                  </div>
                </div>
              )
            })}
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs">Saturasi Tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs">Potensi Tinggi</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-destructive text-[18px]">local_fire_department</span>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Wilayah Terpadat</h3>
              </div>
              {dense ? (
                <>
                  <div>
                    <p className="text-2xl font-bold truncate">{dense.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-bold text-destructive">{dense.count}</span> pencarian
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Porsi Pencarian</span>
                      <span className="font-bold">{dense.pct}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-2">
                      <div className="bg-destructive h-full rounded-full" style={{ width: `${dense.pct}%` }} />
                    </div>
                  </div>
                </>
              ) : <p className="text-sm text-muted-foreground py-4">Belum ada data</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Wilayah Potensial</h3>
              </div>
              {potential ? (
                <>
                  <div>
                    <p className="text-2xl font-bold truncate">{potential.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pertumbuhan <span className="font-bold text-secondary">+{potential.growthPct}%</span>
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{potential.count} pencarian, rata-rata {potential.avgPlaces} usaha per search</p>
                </>
              ) : dense ? (
                <p className="text-sm text-muted-foreground">Data belum cukup untuk analisis pertumbuhan</p>
              ) : <p className="text-sm text-muted-foreground py-4">Belum ada data</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">construction</span>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Prioritas Analisis</h3>
              </div>
              <ul className="space-y-3">
                {districts.slice(0, 3).map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${d.isDense ? "bg-destructive" : "bg-secondary"}`} />
                    <span><strong>{d.name}</strong>: {d.count} pencarian {d.isDense ? "(padat)" : d.isGrowing ? `(+${d.growthPct}%)` : ""}</span>
                  </li>
                ))}
                {districts.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold">Kepadatan vs Saturasi</h3>
              <span className="text-xs text-muted-foreground">Per wilayah</span>
            </div>
            {districts.length > 0 ? (
              <div className="space-y-5">
                {districts.map((d, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div>
                      <p className="font-semibold text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.status}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold">{d.count} pencarian</p>
                        <div className="w-32 bg-muted h-1.5 rounded-full mt-1">
                          <div className={`h-full rounded-full ${d.barColor}`} style={{ width: `${d.pct}%` }} />
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                        d.icon === "warning" ? "text-destructive" : d.icon === "info" ? "text-primary" : "text-secondary"
                      }`}>{d.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-10">Belum ada data pencarian</p>}
          </CardContent>
        </Card>

        <Card className="border-secondary/30 shadow-sm border-l-4 border-l-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">smart_toy</span>
          </div>
          <CardContent className="p-5 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">auto_awesome</span>
              <h3 className="text-base font-semibold">Rekomendasi Strategis</h3>
            </div>
            {data?.insight ? (
              <div className="bg-secondary/5 rounded-xl p-5 border border-secondary/10">
                <p className="text-sm leading-relaxed italic" dangerouslySetInnerHTML={{
                  __html: data.insight
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </div>
            ) : <p className="text-sm text-muted-foreground">Memuat data...</p>}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["AD", "SR"].map((init, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                    {init}
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Analisis otomatis dari data real</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
