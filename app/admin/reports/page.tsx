"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import PrintPdfButton from "@/components/PrintPdfButton"

export default function AdminReports() {
  const [rows, setRows] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [userId, setUserId] = useState("")

  function load() {
    const params = new URLSearchParams({ page: String(page), limit: "20" })
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    if (userId) params.set("user_id", userId)

    fetch(`/api/admin/reports?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.rows) return
        setRows(data.rows)
        setTotal(data.total)
        setTotalPages(data.totalPages)
        setSummary(data.summary)
        if (data.users) setUsers(data.users)
        setSelectedIds(data.rows.map((r: any) => r.id))
      })
  }

  useEffect(() => { load() }, [page])

  function toggle(id: number) {
    setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  }

  function toggleAll() {
    setSelectedIds(selectedIds.length === rows.length ? [] : rows.map((r) => r.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Pencarian</h1>
          <p className="text-sm text-muted-foreground">{total} pencarian · {selectedIds.length} dipilih</p>
        </div>
        <PrintPdfButton
          title={`Laporan Pencarian${from ? " — " + from + " s/d " + (to || "sekarang") : ""}`}
          data={rows}
          selectedIds={selectedIds}
          summary={summary ? `Total: ${summary.total} pencarian · ${summary.uniqueUsers} user · ${Math.round(summary.avgResults * 10) / 10} rata-rata usaha` : undefined}
        />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-end">
          <div>
            <p className="text-xs text-gray-500 mb-1">Dari</p>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-40" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Sampai</p>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 w-40" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">User</p>
            <Select value={userId} onValueChange={(v) => setUserId(v || "")}>
              <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Semua user" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua user</SelectItem>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={String(u.id)}>{u.name || u.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={() => { setPage(1); load() }}>Terapkan Filter</Button>
          {(from || to || userId) && (
            <Button variant="ghost" size="sm" onClick={() => { setFrom(""); setTo(""); setUserId(""); setPage(1); }}>
              Reset
            </Button>
          )}
        </CardContent>
      </Card>

      {summary && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>🔍 {summary.total} pencarian</span>
          <span>👥 {summary.uniqueUsers} user</span>
          <span>🏪 {Math.round(summary.avgResults * 10) / 10} rata-rata usaha</span>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={selectedIds.length === rows.length && rows.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Usaha</TableHead>
                <TableHead className="hidden md:table-cell">Rekomendasi</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Belum ada laporan</TableCell></TableRow>
              ) : rows.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell><Checkbox checked={selectedIds.includes(r.id)} onCheckedChange={() => toggle(r.id)} /></TableCell>
                  <TableCell className="text-sm">{r.user_name || r.user_email || "-"}</TableCell>
                  <TableCell className="max-w-40 truncate text-sm">{r.location}</TableCell>
                  <TableCell>{r.results_count}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-gray-500 max-w-36 truncate">
                    {(r.recommendations || []).slice(0, 2).map((rec: any) => rec.business).join(", ")}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>« Sebelumnya</Button>
          <span className="text-sm text-gray-500">Halaman {page} dari {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Selanjutnya »</Button>
        </div>
      )}
    </div>
  )
}
