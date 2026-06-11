"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchBarProps {
  onSearch: (location: string, address: string, lat: number, lng: number, radius: number) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState("500")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    })
    const data = await res.json()
    if (data.lat && data.lng) {
      onSearch(location, data.address || location, data.lat, data.lng, parseInt(radius))
    } else {
      setError(data.error || "Lokasi tidak ditemukan")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            placeholder="Cari lokasi (jalan/kecamatan/kota)..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <Select value={radius} onValueChange={(v) => v && setRadius(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500">500m</SelectItem>
            <SelectItem value="1000">1 km</SelectItem>
            <SelectItem value="2000">2 km</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading}>
          {loading ? "Menganalisis..." : "Cari"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
