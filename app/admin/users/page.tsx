"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editTarget, setEditTarget] = useState<any>(null)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  function loadUsers() {
    fetch(`/api/admin/users?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        if (data.rows) {
          setUsers(data.rows)
          setTotal(data.total)
          setTotalPages(data.totalPages)
        }
      })
      .catch(() => setUsers([]))
  }

  useEffect(() => { loadUsers() }, [page])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setOpenAdd(false)
      setForm({ name: "", email: "", password: "", role: "user" })
      loadUsers()
    } else {
      setMsg(data.message || "Gagal membuat user")
    }
  }

  function openEditModal(u: any) {
    setEditTarget(u)
    setForm({ name: u.name || "", email: u.email, password: "", role: u.role })
    setMsg("")
    setOpenEdit(true)
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    const res = await fetch(`/api/admin/users/${editTarget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setOpenEdit(false)
      loadUsers()
    } else {
      setMsg(data.message || "Gagal mengupdate user")
    }
  }

  async function toggleBlock(u: any) {
    const label = u.is_active ? "blokir" : "aktifkan"
    if (!confirm(`Yakin ${label} user "${u.email}"?`)) return
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "PATCH" })
    const data = await res.json()
    if (res.ok) loadUsers()
    else alert(data.message)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola User</h1>
          <p className="text-sm text-muted-foreground">{total} user terdaftar</p>
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger render={<Button />}>+ Tambah User</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah User Baru</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <Input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Select value={form.role} onValueChange={(v) => v && setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {msg && <p className="text-red-500 text-sm">{msg}</p>}
              <Button type="submit" disabled={saving} className="w-full">{saving ? "Menyimpan..." : "Simpan"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Cari</TableHead>
                <TableHead>Daftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-gray-500 py-8">Belum ada user</TableCell></TableRow>
              ) : (
                users.map((u: any) => (
                  <TableRow key={u.id} className={u.is_active ? "" : "bg-gray-50"}>
                    <TableCell className="font-medium">{u.name || "-"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.is_active ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Aktif</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Blokir</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>{u.search_count || 0}</TableCell>
                    <TableCell className="text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(u)}>✏️</Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleBlock(u)}>
                          {u.is_active ? "🔴" : "🟢"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-3">
            <Input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Password (kosongkan jika tidak diubah)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Select value={form.role} onValueChange={(v) => v && setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {msg && <p className="text-red-500 text-sm">{msg}</p>}
            <Button type="submit" disabled={saving} className="w-full">{saving ? "Menyimpan..." : "Simpan"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
