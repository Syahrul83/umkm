export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <span className="text-lg font-bold tracking-tight">MapIde <span className="text-secondary">UMKM</span></span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("/batik-bg.png")` }}
        />
        <div className="text-center max-w-md relative">
          <span className="material-symbols-outlined text-6xl mb-4 block text-muted-foreground">lock</span>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Pendaftaran Ditutup</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Pendaftaran untuk lomba hanya melalui admin.<br />
            Silakan hubungi panitia untuk mendapatkan akun demo.
          </p>
          <a href="/login" className="text-primary font-semibold hover:underline text-sm">
            Kembali ke Login
          </a>
        </div>
      </main>

      <footer className="bg-white border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-6 text-center text-xs text-muted-foreground">
          © 2024 MapIde UMKM. Pemberdayaan Pengusaha Lokal.
        </div>
      </footer>
    </div>
  )
}
