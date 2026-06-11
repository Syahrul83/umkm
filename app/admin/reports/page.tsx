"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PrintPdfButton from "@/components/PrintPdfButton"

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then(setReports)
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Laporan</h1>
          <p className="text-sm text-gray-500">Semua aktivitas pencarian pengguna</p>
        </div>
        <PrintPdfButton title="Laporan Pencarian" data={reports} />
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Usaha Ditemukan</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Belum ada laporan
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.user_name || r.user_email || "-"}</TableCell>
                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.results_count}</TableCell>
                    <TableCell>
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
