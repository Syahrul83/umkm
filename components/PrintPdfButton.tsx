"use client"
import { Button } from "@/components/ui/button"

interface PrintPdfButtonProps {
  title: string
  data: any[]
  selectedIds?: number[]
  summary?: string
}

export default function PrintPdfButton({ title, data, selectedIds, summary }: PrintPdfButtonProps) {
  const items = selectedIds ? data.filter((d) => selectedIds.includes(d.id)) : data

  async function handlePrint() {
    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    let y = 20

    doc.setFontSize(14)
    doc.text(title, 14, y)
    y += 8
    doc.setFontSize(9)
    if (summary) { doc.text(summary, 14, y); y += 6 }

    const colW = [8, 32, 38, 14, 48, 30]
    const headers = ["No", "User", "Lokasi", "Usaha", "Rekomendasi", "Tanggal"]

    doc.setFontSize(8)
    headers.forEach((h, i) => {
      const x = 14 + colW.slice(0, i).reduce((a, b) => a + b, 0)
      doc.text(h, x, y)
    })
    y += 4
    doc.line(14, y - 1, 14 + colW.reduce((a, b) => a + b), y - 1)

    items.forEach((item, i) => {
      if (y > 270) { doc.addPage(); y = 20 }
      const vals = [
        String(i + 1),
        item.user_email || "-",
        item.location,
        String(item.results_count || 0),
        (item.recommendations || []).slice(0, 2).map((r: any) => r.business).join(", "),
        new Date(item.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
      ]
      vals.forEach((v, ci) => {
        const x = 14 + colW.slice(0, ci).reduce((a, b) => a + b, 0)
        doc.text(v.length > 18 ? v.slice(0, 17) + "…" : v, x, y)
      })
      y += 6
    })

    doc.save(`${title}.pdf`)
  }

  return (
    <Button variant="outline" onClick={handlePrint} disabled={items.length === 0}>
      🖨️ Cetak PDF {selectedIds ? `(${items.length})` : ""}
    </Button>
  )
}
