"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import PrintPdfButton from "@/components/PrintPdfButton"

interface HistoryItem {
  id: number
  location: string
  address: string
  results_count: number
  created_at: string
  recommendations: { rank: number; business: string; score: number; reason: string }[]
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setItems(data)
        setSelectedIds(data.map((d: HistoryItem) => d.id))
      })
  }, [])

  function toggle(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i.id))
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Pencarian</h1>
          <p className="text-sm text-gray-500">
            {items.length} pencarian · {selectedIds.length} dipilih
          </p>
        </div>
        <PrintPdfButton title="Riwayat Pencarian" data={items} selectedIds={selectedIds} />
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={selectedIds.length === items.length && items.length > 0}
            onCheckedChange={toggleAll}
          />
          <span className="text-gray-500 cursor-pointer" onClick={toggleAll}>
            {selectedIds.length === items.length ? "Batalkan semua" : "Pilih semua"}
          </span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p>Belum ada riwayat pencarian.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`transition-colors ${selectedIds.includes(item.id) ? "" : "opacity-50"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggle(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.location}</p>
                    {item.address && item.address !== item.location && (
                      <p className="text-xs text-gray-400 truncate">📍 {item.address}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                      <span>🏪 {item.results_count} usaha</span>
                      {item.recommendations?.slice(0, 3).map((r) => (
                        <span key={r.rank} className="text-xs">
                          {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉"} {r.business}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
