"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.message || "Gagal mendaftar")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <span className="text-lg font-bold tracking-tight">MapIde UMKM</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("/batik-bg.png")` }}
        />
        <section className="w-full max-w-md">
          <div className="bg-white border border-border rounded-xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight mb-1">Daftar Akun</h1>
              <p className="text-sm text-muted-foreground">Buat akun MapIde UMKM Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Nama</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Daftar
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <a href="/login" className="text-primary font-semibold hover:underline">Masuk</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-6 text-center text-xs text-muted-foreground">
          © 2024 MapIde UMKM. Pemberdayaan Pengusaha Lokal.
        </div>
      </footer>
    </div>
  )
}
