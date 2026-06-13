"use client"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface PrintPdfButtonProps {
  title: string
  data: any[]
  selectedIds?: number[]
  summary?: string
}

export default function PrintPdfButton({ title, data, selectedIds, summary }: PrintPdfButtonProps) {
  const items = selectedIds ? data.filter((d) => selectedIds.includes(d.id)) : data

  async function handlePrint() {
    const doc = new jsPDF()

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(title, 14, 18)

    let y = 18
    if (summary) {
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(summary, 14, 26)
      y = 32
    } else {
      y = 26
    }

    const rows = items.map((item: any) => [
      item.user_email || "-",
      item.location,
      String(item.results_count || 0),
      (item.recommendations || []).slice(0, 3).map((r: any) => r.business).join("\n"),
      new Date(item.created_at).toLocaleDateString("id-ID", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      }),
    ])

    ;(doc as any).autoTable({
      startY: y,
      head: [["User", "Lokasi", "Usaha", "Rekomendasi", "Tanggal"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 45 },
        2: { cellWidth: 14, halign: "center" },
        3: { cellWidth: 55, cellPadding: 1.5 },
        4: { cellWidth: 28, halign: "center" },
      },
      didParseCell: (data: any) => {
        if (data.column.index === 3 && data.cell.raw) {
          const lines = data.cell.raw.split("\n").length
          data.row.height = Math.max(data.row.height, lines * 5)
        }
      },
      margin: { top: 14 },
      pageBreak: "auto",
    })

    const pageCount = (doc.internal as any).getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      )
    }

    doc.save(`${title}.pdf`)
  }

  return (
    <Button
      variant="default"
      className="flex items-center gap-2 px-4"
      onClick={handlePrint}
      disabled={items.length === 0}
    >
      <span className="material-symbols-outlined text-[18px]">print</span>
      Cetak PDF {selectedIds ? `(${items.length})` : ""}
    </Button>
  )
}
