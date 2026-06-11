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
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetch(`/api/history?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.rows)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      })
  }, [page])

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
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Pencarian</h1>
          <p className="text-sm text-muted-foreground">
            {total} pencarian · {selectedIds.length} dipilih
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
        <div className="text-center py-16 text-muted-foreground">
          <span className="material-symbols-outlined text-5xl mb-3 block">history</span>
          <p>Belum ada riwayat pencarian.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                « Sebelumnya
              </Button>
              <span className="text-sm text-gray-500">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Selanjutnya »
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
