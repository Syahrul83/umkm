export default function AdminStatistik() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistik UMKM</h1>
        <p className="text-sm text-muted-foreground">Analisis pertumbuhan dan distribusi usaha</p>
      </div>
      <div className="border-2 border-dashed border-border rounded-xl p-20 text-center text-muted-foreground">
        <span className="material-symbols-outlined text-5xl mb-4 block">bar_chart</span>
        <p className="text-lg font-medium">Halaman Statistik</p>
        <p className="text-sm mt-1">Dalam pengembangan — data pertumbuhan UMKM akan ditampilkan di sini.</p>
      </div>
    </div>
  )
}
