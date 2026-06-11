"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) {
      setError("Email atau password salah")
    } else {
      const session = await fetch("/api/auth/session").then(r => r.json())
      const role = session?.user?.role
      if (role === "admin") {
        router.push("/admin/overview")
      } else {
        router.push("/search")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl text-center">MapIde UMKM</CardTitle>
          <p className="text-sm text-gray-500 text-center">Temukan peluang usaha UMKM</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Masuk</Button>
          </form>
          <p className="text-center mt-4 text-sm">
            Belum punya akun?{" "}
            <a href="/register" className="text-blue-600 hover:underline">Daftar</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
