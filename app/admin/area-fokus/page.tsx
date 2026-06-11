"use client"
import { Card, CardContent } from "@/components/ui/card"

const districts = [
  { name: "Samarinda Utara", status: "Sangat Padat", units: 1245, pct: 100, color: "bg-destructive", icon: "warning" },
  { name: "Samarinda Seberang", status: "Normal", units: 842, pct: 65, color: "bg-primary", icon: "info" },
  { name: "Palaran", status: "Potensial", units: 312, pct: 25, color: "bg-secondary", icon: "auto_awesome" },
]

export default function AdminAreaFokus() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analisis Area Fokus</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Identifikasi wilayah potensial dan kepadatan UMKM di Samarinda dan sekitarnya.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filter Peta
          </button>
          <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Ekspor Laporan
          </button>
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

            <div className="absolute top-[30%] left-[45%] group cursor-pointer">
              <div className="w-14 h-14 bg-destructive/30 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-destructive rounded-full border-2 border-white shadow-lg" />
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-white px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                Samarinda Utara: 1,245 UMKM
              </div>
            </div>

            <div className="absolute top-[60%] left-[25%] group cursor-pointer">
              <div className="w-16 h-16 bg-secondary/30 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-lg" />
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-white px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                Palaran: Potensi Tinggi
              </div>
            </div>

            <div className="absolute top-[50%] left-[70%] group cursor-pointer">
              <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg" />
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-4 flex flex-col gap-1 bg-white/90 backdrop-blur-md p-1 rounded-lg border border-border shadow-sm">
            <button className="w-8 h-8 hover:bg-muted flex items-center justify-center rounded material-symbols-outlined text-[18px]">add</button>
            <div className="h-[1px] bg-border mx-1" />
            <button className="w-8 h-8 hover:bg-muted flex items-center justify-center rounded material-symbols-outlined text-[18px]">remove</button>
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg max-w-xs">
            <h4 className="text-sm font-medium mb-2">Legenda Kepadatan</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Rendah</span>
                <div className="flex-1 mx-2 h-2 rounded-full bg-gradient-to-r from-secondary to-destructive" />
                <span>Tinggi</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Update terakhir: 12 Menit yang lalu</p>
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
              <div>
                <p className="text-2xl font-bold">Samarinda Utara</p>
                <p className="text-sm text-muted-foreground mt-1"><span className="font-bold text-destructive">1,245</span> UMKM Terdaftar</p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kapasitas Maksimal</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div className="bg-destructive h-full rounded-full w-[92%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Wilayah Potensial</h3>
              </div>
              <div>
                <p className="text-2xl font-bold">Palaran</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Saturasi Rendah, Pertumbuhan <span className="font-bold text-secondary">+12.4%</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Cocok untuk sektor industri kreatif dan manufaktur skala mikro.</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">construction</span>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Prioritas Infrastruktur</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>Peningkatan Akses Logistik Samarinda Seberang</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span>Digitalisasi Pasar Pagi Area</span>
                </li>
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
              <select className="bg-muted border border-border rounded-lg text-sm px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20">
                <option>Per Kecamatan</option>
                <option>Per Kelurahan</option>
              </select>
            </div>
            <div className="space-y-5">
              {districts.map((d, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div>
                    <p className="font-semibold text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold">{d.units.toLocaleString()} unit</p>
                      <div className="w-32 bg-muted h-1.5 rounded-full mt-1">
                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                      d.icon === "warning" ? "text-destructive" : d.icon === "info" ? "text-primary" : "text-secondary"
                    }`}>{d.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/30 shadow-sm border-l-4 border-l-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">smart_toy</span>
          </div>
          <CardContent className="p-5 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">auto_awesome</span>
              <h3 className="text-base font-semibold">Rekomendasi Strategis AI</h3>
            </div>
            <div className="bg-secondary/5 rounded-xl p-5 border border-secondary/10">
              <p className="text-sm leading-relaxed italic">
                &ldquo;Berdasarkan analisis data bulan ini, wilayah <strong>Samarinda Utara</strong> telah mencapai titik jenuh untuk bisnis kuliner. Disarankan untuk mengalihkan insentif program pemberdayaan ke wilayah <strong>Palaran</strong> dan <strong>Loa Janan Ilir</strong> dengan fokus pada UMKM berbasis manufaktur rumah tangga. Selain itu, percepatan pembangunan gerai logistik bersama di <strong>Samarinda Seberang</strong> akan menurunkan biaya operasional UMKM sebesar 15%.&rdquo;
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["AD", "SR"].map((init, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                    {init}
                  </div>
                ))}
              </div>
              <button className="bg-secondary text-white px-5 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center gap-2 shadow-sm">
                Terapkan Strategi
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
