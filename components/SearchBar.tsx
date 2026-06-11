"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchBarProps {
  onSearch: (location: string, lat: number, lng: number, radius: number) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState("500")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const geo = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
    const geoData = await geo.json()
    if (geoData.results?.[0]) {
      const { lat, lng } = geoData.results[0].geometry.location
      onSearch(location, lat, lng, parseInt(radius))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
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
    </form>
  )
}
