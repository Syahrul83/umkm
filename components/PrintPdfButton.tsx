"use client"
import { Button } from "@/components/ui/button"

interface PrintPdfButtonProps {
  title: string
  data: any[]
  selectedIds?: number[]
}

export default function PrintPdfButton({ title, data, selectedIds }: PrintPdfButtonProps) {
  const items = selectedIds ? data.filter((d) => selectedIds.includes(d.id)) : data

  async function handlePrint() {
    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 14, 20)
    doc.setFontSize(10)

    let y = 30
    items.forEach((item, i) => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(11)
      doc.text(`${i + 1}. ${item.location}`, 14, y)
      y += 6
      doc.setFontSize(9)
      if (item.address && item.address !== item.location) {
        doc.text(`   📍 ${item.address}`, 14, y)
        y += 5
      }
      doc.text(`   🏪 ${item.results_count || 0} usaha ditemukan`, 14, y)
      y += 5
      if (item.recommendations?.length) {
        const recs = item.recommendations
          .slice(0, 3)
          .map((r: any) => r.business)
          .join(", ")
        doc.text(`   💡 ${recs}`, 14, y)
        y += 5
      }
      const date = new Date(item.created_at).toLocaleDateString("id-ID", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      })
      doc.text(`   📅 ${date}`, 14, y)
      y += 10
    })

    doc.save(`${title}.pdf`)
  }

  return (
    <Button variant="outline" onClick={handlePrint} disabled={items.length === 0}>
      🖨️ Cetak PDF {selectedIds && `(${items.length})`}
    </Button>
  )
}
