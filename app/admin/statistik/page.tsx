"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const kpiData = [
  { icon: "storefront", label: "Bisnis Baru", value: "1.284", trend: "+12% vs bulan lalu", color: "bg-blue-50", iconBg: "bg-blue-100" },
  { icon: "query_stats", label: "Tingkat Pertumbuhan", value: "8.4%", trend: "+2.1% peningkatan", color: "bg-green-50", iconBg: "bg-green-100" },
  { icon: "explore", label: "Wilayah Teraktif", value: "Samarinda", trend: "420 Registrasi baru", color: "bg-gray-50", iconBg: "bg-gray-100" },
  { icon: "military_tech", label: "Kategori Unggulan", value: "Kuliner", trend: "35% dari total UMKM", color: "bg-red-50", iconBg: "bg-red-100" },
]

const monthlyData = [
  { month: "Jan", thisYear: 120, lastYear: 90 },
  { month: "Feb", thisYear: 180, lastYear: 110 },
  { month: "Mar", thisYear: 150, lastYear: 130 },
  { month: "Apr", thisYear: 210, lastYear: 160 },
  { month: "Mei", thisYear: 240, lastYear: 180 },
  { month: "Jun", thisYear: 190, lastYear: 150 },
  { month: "Jul", thisYear: 342, lastYear: 200 },
]

const regionData = [
  { name: "Samarinda", pct: 60, color: "#000000" },
  { name: "Balikpapan", pct: 25, color: "#006a61" },
  { name: "Lainnya", pct: 15, color: "#cbd5e1" },
]

const categoryData = [
  { category: "Makanan & Minuman", pct: 45 },
  { category: "Retail & Dagang", pct: 28 },
  { category: "Jasa Kreatif", pct: 15 },
  { category: "Teknologi & Digital", pct: 12 },
]

const insights = [
  { icon: "lightbulb", text: "Sektor Kuliner di Samarinda Utara menunjukkan saturasi tinggi. Disarankan memberikan insentif untuk sektor Logistik guna menyeimbangkan ekosistem." },
  { icon: "trending_up", text: "Prediksi pertumbuhan bulan depan mencapai +5.2%, didorong oleh peluncuran program hibah daerah baru." },
  { icon: "priority_high", text: "Terdapat anomali data pendaftaran di wilayah Balikpapan Timur yang memerlukan verifikasi manual segera." },
]

const circumference = 2 * Math.PI * 40
let offset = 0
const segments = regionData.map((r) => {
  const dash = (r.pct / 100) * circumference
  const seg = { ...r, dash, offset }
  offset += dash
  return seg
})

export default function AdminStatistik() {
  const [range, setRange] = useState("30")

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
        {kpiData.map((kpi, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <span className={`material-symbols-outlined text-[18px] p-1 rounded ${kpi.iconBg}`}>{kpi.icon}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-xs text-secondary mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold">Tren Registrasi UMKM</h3>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-full" /> Tahun Ini</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-muted-foreground/30 rounded-full" /> Tahun Lalu</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="thisYear" fill="#000000" radius={[4, 4, 0, 0]} name="Tahun Ini" />
                <Bar dataKey="lastYear" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Tahun Lalu" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-4">Distribusi Wilayah</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {segments.map((s, i) => (
                    <circle key={i} cx="50" cy="50" r="40" fill="transparent"
                      stroke={s.color} strokeWidth="12" strokeDasharray={s.dash}
                      strokeDashoffset={-s.offset + circumference}
                      className="transition-all duration-500"
                    />
                  ))}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12"
                    strokeDasharray={circumference} strokeDashoffset={0} className="opacity-30" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-bold">10+</span>
                  <span className="text-xs text-muted-foreground">Kota</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                {regionData.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      {r.name}
                    </span>
                    <span className="font-medium">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-4">Kategori UMKM Terpopuler</h3>
            <div className="space-y-4">
              {categoryData.map((c, i) => (
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
              <h3 className="text-base font-semibold">Wawasan AI</h3>
            </div>
            <ul className="space-y-4">
              {insights.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">{item.icon}</span>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-2.5 bg-secondary text-white rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
              Unduh Laporan Analitik Penuh
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
