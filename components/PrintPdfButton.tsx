"use client"
import { Button } from "@/components/ui/button"

interface PrintPdfButtonProps {
  title: string
  data: { location: string; results_count: number; created_at: string; recommendations?: string }[]
}

export default function PrintPdfButton({ title, data }: PrintPdfButtonProps) {
  async function handlePrint() {
    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 14, 20)
    doc.setFontSize(10)
    data.forEach((item, i) => {
      const y = 30 + i * 8
      if (y > 280) return
      const date = new Date(item.created_at).toLocaleDateString("id-ID")
      doc.text(`${i + 1}. ${item.location} — ${item.results_count} usaha — ${date}`, 14, y)
    })
    doc.save(`${title}.pdf`)
  }

  return (
    <Button variant="outline" onClick={handlePrint}>
      🖨️ Cetak PDF
    </Button>
  )
}
