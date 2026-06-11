"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStats {
  totalUsers: number
  totalSearches: number
  uniqueLocations: number
  topLocations: { location: string; count: number }[]
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-6 h-24 bg-gray-100 animate-pulse rounded-lg" /></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Total User</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.totalSearches}</p>
            <p className="text-sm text-gray-500">Total Pencarian</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.uniqueLocations}</p>
            <p className="text-sm text-gray-500">Lokasi Unik</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>📍 Top 10 Lokasi Paling Dicari</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topLocations?.map((loc, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <span>{i + 1}. {loc.location}</span>
                <span className="text-sm text-gray-500">{loc.count} pencarian</span>
              </div>
            ))}
            {(!stats.topLocations || stats.topLocations.length === 0) && (
              <p className="text-sm text-gray-500">Belum ada data</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
