"use client"
import { useState } from "react"
import SearchBar from "@/components/SearchBar"
import MapView, { MapSkeleton } from "@/components/MapView"
import StatCard from "@/components/StatCard"
import RecommendationCard from "@/components/RecommendationCard"
import AIModal from "@/components/AIModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
  const [location, setLocation] = useState("")
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  async function handleSearch(loc: string, lat: number, lng: number, radius: number) {
    setLoading(true)
    setLocation(loc)
    setCoords({ lat, lng })
    setResult(null)

    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, radius, location: loc }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-1">Cari Peluang Usaha</h1>
        <p className="text-sm text-gray-500">Masukkan lokasi untuk melihat analisis kompetitor dan rekomendasi usaha</p>
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} />

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
            <div className="mb-2">
              <Button variant="outline" size="sm">🔥 Heatmap</Button>
            </div>
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
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">🗺️</p>
          <p>Cari lokasi untuk memulai analisis</p>
        </div>
      )}
    </div>
  )
}
