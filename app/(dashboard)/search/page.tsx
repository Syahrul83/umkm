"use client"
import { useState, useEffect } from "react"
import SearchBar from "@/components/SearchBar"
import MapView, { MapSkeleton } from "@/components/MapView"
import StatCard from "@/components/StatCard"
import RecommendationCard from "@/components/RecommendationCard"
import AIModal from "@/components/AIModal"
import LoadingAnimation from "@/components/LoadingAnimation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    if (!navigator.geolocation) {
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setCoords(JAKARTA)
        setLocating(false)
      },
      { timeout: 5000, enableHighAccuracy: false }
    )
  }, [])

  async function handleSearch(loc: string, addr: string, lat: number, lng: number, radius: number) {
    setLoading(true)
    setError("")
    setLocation(loc)
    setCoords({ lat, lng })
    setResult(null)
    setMarker(null)

    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, radius, location: loc, address: addr }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError("Gagal terhubung ke server")
    }
    setLoading(false)
  }

  async function handlePinSelect(lat: number, lng: number) {
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      })
      const data = await res.json()
      setMarker({ lat, lng, address: data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    } catch {
      setMarker({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cari Peluang Usaha</h1>
        <p className="text-sm text-muted-foreground">
          Ketik lokasi atau klik peta untuk analisis kompetitor dan rekomendasi
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
        {result && (
          <Button variant="outline" onClick={() => { setResult(null); setMarker(null); setError(""); }}>
            🔄 Cari Baru
          </Button>
        )}
      </div>
      {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">{error}</div>}

      {loading && <LoadingAnimation />}

      {result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="h-[500px]">
              <MapView places={result.places} center={coords} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{result.places.length} usaha ditemukan</p>
          </div>

          <div className="space-y-4">
            <Card className="border-border/50 shadow-sm">
              <CardHeader><CardTitle className="text-sm font-semibold">Statistik Usaha</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {result.analysis?.stats?.map((s: any) => (
                  <StatCard
                    key={s.category}
                    category={s.category}
                    count={s.count}
                    avgRating={s.avgRating}
                    percentage={s.percentage}
                    isOvercrowded={result.analysis.overcrowded?.includes(s.category)}
                  />
                ))}
                {(!result.analysis?.stats || result.analysis.stats.length === 0) && (
                  <p className="text-sm text-gray-500">Tidak ada data statistik</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">Rekomendasi</CardTitle>
                <AIModal location={location} places={result.places} />
              </CardHeader>
              <CardContent className="space-y-2">
                {result.analysis?.recommendations?.map((r: any) => (
                  <RecommendationCard key={r.rank} {...r} />
                ))}
                {(!result.analysis?.recommendations || result.analysis.recommendations.length === 0) && (
                  <p className="text-sm text-gray-500">Tidak ada rekomendasi</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!loading && !result && !locating && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="h-[500px]">
              <MapView
                places={[]}
                center={coords}
                onLocationSelect={handlePinSelect}
              />
            </div>
            {marker && (
              <div className="mt-3 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm flex-1">📍 {marker.address}</p>
                <Select value={pinRadius} onValueChange={(v) => v && setPinRadius(v)}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500m</SelectItem>
                    <SelectItem value="1000">1 km</SelectItem>
                    <SelectItem value="2000">2 km</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={() =>
                    handleSearch(marker.address, marker.address, marker.lat, marker.lng, parseInt(pinRadius))
                  }
                >
                  🔍 Cari area ini
                </Button>
              </div>
            )}
          </div>
          <div className="text-center py-16 text-muted-foreground">
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
  )
}
