"use client"
import { useState, useEffect } from "react"
import SearchBar from "@/components/SearchBar"
import MapView, { MapSkeleton } from "@/components/MapView"
import StatCard from "@/components/StatCard"
import RecommendationCard from "@/components/RecommendationCard"
import AIModal from "@/components/AIModal"
import LoadingAnimation from "@/components/LoadingAnimation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const JAKARTA = { lat: -6.2088, lng: 106.8456 }

interface SearchResult {
  places: any[]
  analysis: {
    stats: { category: string; count: number; avgRating: number; percentage: number }[]
    overcrowded: string[]
    recommendations: { rank: number; business: string; score: number; reason: string }[]
  }
}

export default function SearchPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState("")
  const [location, setLocation] = useState("")
  const [coords, setCoords] = useState(JAKARTA)
  const [marker, setMarker] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [pinRadius, setPinRadius] = useState("500")
  const [locating, setLocating] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false) },
      () => { setCoords(JAKARTA); setLocating(false) },
      { timeout: 5000, enableHighAccuracy: false }
    )
  }, [])

  async function handleSearch(loc: string, addr: string, lat: number, lng: number, radius: number) {
    setLoading(true); setError(""); setLocation(loc); setCoords({ lat, lng }); setResult(null); setMarker(null)
    try {
      const res = await fetch("/api/places", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, radius, location: loc, address: addr }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch { setError("Gagal terhubung ke server") }
    setLoading(false)
  }

  async function handlePinSelect(lat: number, lng: number) {
    try {
      const res = await fetch("/api/geocode", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      })
      const data = await res.json()
      setMarker({ lat, lng, address: data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    } catch { setMarker({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }) }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-6">
          <header>
            <h1 className="text-2xl font-bold tracking-tight">Cari Peluang Usaha</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              🔍 <strong>Cara pakai:</strong> Ketik nama lokasi (jalan/kecamatan/kota) lalu klik <strong>Cari</strong>, 
              atau langsung <strong>klik peta</strong> untuk menandai titik lalu tekan <strong>"Cari area ini"</strong>. 
              AI akan menganalisis kompetitor dan memberi 3 rekomendasi usaha terbaik.
            </p>
          </header>

          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">{error}</div>}

          <div className="flex items-center gap-2">
            {result && (
              <Button
                variant="default"
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white px-6"
                onClick={() => { setResult(null); setMarker(null); setError("") }}
              >
                <span className="material-symbols-outlined text-[18px] mr-1">refresh</span>
                Cari Baru
              </Button>
            )}
          </div>

          {loading && <LoadingAnimation />}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="h-[500px]">
                  <MapView places={result.places} center={coords} />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground italic">
                  <span>* {result.places.length} usaha ditemukan di area terpilih</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary">bar_chart</span>
                      <h2 className="text-base font-semibold">Statistik Usaha</h2>
                    </div>
                    <div className="space-y-4">
                      {result.analysis?.stats?.map((s: any) => (
                        <StatCard key={s.category} {...s} isOvercrowded={result.analysis.overcrowded?.includes(s.category)} />
                      ))}
                      {(!result.analysis?.stats || result.analysis.stats.length === 0) && (
                        <p className="text-sm text-muted-foreground">Tidak ada data statistik</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-[80px]">auto_awesome</span>
                  </div>
                  <CardContent className="p-5 relative">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">lightbulb</span>
                        <h2 className="text-base font-semibold">Rekomendasi AI</h2>
                      </div>
                      <AIModal location={location} places={result.places} />
                    </div>
                    <div className="space-y-3">
                      {result.analysis?.recommendations?.map((r: any) => (
                        <RecommendationCard key={r.rank} {...r} />
                      ))}
                      {(!result.analysis?.recommendations || result.analysis.recommendations.length === 0) && (
                        <p className="text-sm text-muted-foreground">Tidak ada rekomendasi</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!loading && !result && !locating && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <div className="h-[500px]">
                  <MapView places={[]} center={coords} onLocationSelect={handlePinSelect} />
                </div>
                {marker && (
                  <div className="mt-3 flex items-center gap-3 bg-muted border border-border rounded-lg p-3">
                    <div className="flex items-center gap-1 text-sm flex-1 min-w-0">
                      <span className="material-symbols-outlined text-muted-foreground text-[16px]">location_on</span>
                      <span className="truncate">{marker.address}</span>
                    </div>
                    <select
                      value={pinRadius}
                      onChange={(e) => setPinRadius(e.target.value)}
                      className="border border-border rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value="500">500m</option>
                      <option value="1000">1 km</option>
                      <option value="2000">2 km</option>
                    </select>
                    <Button size="default" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium"
                      onClick={() => handleSearch(marker.address, marker.address, marker.lat, marker.lng, parseInt(pinRadius))}>
                      <span className="material-symbols-outlined text-[18px] mr-1">search</span>
                      Cari area ini
                    </Button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 text-center py-16 text-muted-foreground">
                <span className="material-symbols-outlined text-5xl mb-3 block">map</span>
                <p>Cari lokasi atau klik peta untuk mulai</p>
              </div>
            </div>
          )}

          {locating && (
            <div className="text-center py-16 text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-3 block animate-spin">progress_activity</span>
              <p>Mendeteksi lokasi Anda...</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold">MapIde UMKM</p>
            <p className="text-xs text-muted-foreground">© 2024 MapIde UMKM. Pemberdayaan Pengusaha Lokal.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Tentang Kami</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Bantuan</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
