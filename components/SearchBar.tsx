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
    <form onSubmit={handleSubmit}>
      <section className="bg-white border border-border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">location_on</span>
            <input
              type="text"
              placeholder="Cari lokasi (jalan/kecamatan/kota)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
            />
          </div>
          <div className="md:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">distance</span>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-primary outline-none bg-white appearance-none text-sm cursor-pointer"
            >
              <option value="500">500 m</option>
              <option value="1000">1 km</option>
              <option value="2000">2 km</option>
            </select>
          </div>
          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">{loading ? "sync" : "search"}</span>
              {loading ? "Mencari..." : "Cari"}
            </button>
            <button
              type="button"
              onClick={() => { setLocation(""); setRadius("500"); setError("") }}
              className="bg-muted text-muted-foreground p-2.5 rounded-lg hover:bg-muted/80 transition-all border border-border flex items-center justify-center"
              title="Reset"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </section>
    </form>
  )
}
