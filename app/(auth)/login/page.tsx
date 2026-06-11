"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) {
      setError("Email atau password salah")
      setLoading(false)
    } else {
      const session = await fetch("/api/auth/session").then((r) => r.json())
      router.push(session?.user?.role === "admin" ? "/admin/overview" : "/search")
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

        <section className="w-full max-w-md relative">
          <div className="bg-white border border-border rounded-xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight mb-1">Selamat Datang</h1>
              <p className="text-sm text-muted-foreground">Silakan masuk ke akun MapIde UMKM Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1" htmlFor="email">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-[18px]">mail</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="password">Kata Sandi</label>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-[18px]">lock</span>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <>
                    Masuk
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Akun demo: <strong>admin@umkm.com</strong> / <strong>admin123</strong>
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-6 opacity-60">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span className="text-xs">Aman & Terenkripsi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-xs">Verifikasi UMKM</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold">MapIde UMKM</p>
            <p className="text-xs text-muted-foreground">© 2024 MapIde UMKM. Pemberdayaan Pengusaha Lokal.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Tentang Kami</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Bantuan</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
