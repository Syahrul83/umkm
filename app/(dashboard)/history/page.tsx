"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import PrintPdfButton from "@/components/PrintPdfButton"

interface HistoryItem {
  id: number
  location: string
  results_count: number
  created_at: string
  recommendations: string
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then(setItems)
  }, [])

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Pencarian</h1>
          <p className="text-sm text-gray-500">Semua pencarian yang pernah kamu lakukan</p>
        </div>
        <PrintPdfButton title="Riwayat Pencarian" data={items} />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p>Belum ada riwayat pencarian.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.location}</p>
                  <p className="text-sm text-gray-500">{item.results_count} usaha ditemukan</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
