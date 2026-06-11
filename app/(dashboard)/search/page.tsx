"use client"
import { useState } from "react"
import SearchBar from "@/components/SearchBar"
import MapView, { MapSkeleton } from "@/components/MapView"
import StatCard from "@/components/StatCard"
import RecommendationCard from "@/components/RecommendationCard"
import AIModal from "@/components/AIModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })
  const [marker, setMarker] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [pinRadius, setPinRadius] = useState("500")

  async function handleSearch(loc: string, lat: number, lng: number, radius: number) {
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
        body: JSON.stringify({ lat, lng, radius, location: loc }),
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
        <h1 className="text-2xl font-bold mb-1">Cari Peluang Usaha</h1>
        <p className="text-sm text-gray-500">
          Ketik lokasi di search bar, atau klik peta untuk tentukan lokasi
        </p>
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}

      {loading && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><MapSkeleton /></div>
          <Card>
            <CardHeader><CardTitle>Menganalisis...</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="h-[500px]">
              <MapView places={result.places} center={coords} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{result.places.length} usaha ditemukan</p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>📊 Statistik Usaha</CardTitle></CardHeader>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>💡 Rekomendasi</CardTitle>
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

      {!loading && !result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="h-[500px]">
              <MapView
                places={[]}
                center={{ lat: -2.5489, lng: 118.0149 }}
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
                    handleSearch(marker.address, marker.lat, marker.lng, parseInt(pinRadius))
                  }
                >
                  🔍 Cari area ini
                </Button>
              </div>
            )}
          </div>
          <div className="text-center py-20 text-gray-400">
            <p className="text-6xl mb-4">🗺️</p>
            <p>Cari lokasi atau klik peta untuk mulai</p>
          </div>
        </div>
      )}
    </div>
  )
}
