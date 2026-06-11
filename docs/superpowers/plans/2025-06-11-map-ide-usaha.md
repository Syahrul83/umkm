# Map Ide UMKM — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a map-based application that helps UMKM find business opportunities by analyzing competitor data via Google Places API + AI recommendations.

**Architecture:** Next.js 16 App Router with Server Actions. Turso for persistence. Auth.js v5 for auth. shadcn/ui + Tailwind CSS for UI. Google Places API for business data. OpenRouter (DeepSeek V4 Flash) for AI analysis.

**Tech Stack:** Next.js 16, Turso, Auth.js v5, Google Places API (New), OpenRouter, shadcn/ui, Tailwind CSS, jsPDF, Recharts

---

### Task 1: Project Scaffolding + Tailwind + shadcn/ui

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`
- Create: `app/globals.css`, `app/layout.tsx`
- Create: `.env.local`

- [ ] **Step 1: Init Next.js 16 project**

```bash
npx create-next-app@latest umkm --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd umkm
```

- [ ] **Step 2: Install shadcn/ui + dependencies**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button card input badge table dialog select skeleton -y
npm install @auth/core next-auth @libsql/client recharts jspdf html2canvas
```

- [ ] **Step 3: Create `.env.local`**

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-token
AUTH_SECRET=your-secret
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
GOOGLE_PLACES_API_KEY=your-key
OPENROUTER_API_KEY=sk-or-v1-...
AI_MODEL=deepseek/deepseek-v4-flash
```

- [ ] **Step 4: Setup `app/layout.tsx`** with Inter font + basic shell

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MapIde UMKM",
  description: "Temukan peluang usaha UMKM berbasis data",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git init && git add -A && git commit -m "chore: init Next.js 16 + shadcn/ui"
```

---

### Task 2: Database Schema + lib/db.ts

**Files:**
- Create: `lib/db.ts`
- Create: `lib/schema.sql`
- Create: `lib/init-db.ts`

- [ ] **Step 1: Create `lib/db.ts`** — Turso client

```ts
import { createClient } from "@libsql/client"

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
```

- [ ] **Step 2: Create `lib/schema.sql`**

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  location TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  radius INTEGER DEFAULT 500,
  results_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS search_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  search_id INTEGER REFERENCES searches(id),
  raw_places TEXT,
  ai_analysis TEXT,
  recommendations TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Step 3: Create `lib/init-db.ts`** — run migrations once

```ts
import { db } from "./db"
import fs from "fs"
import path from "path"

export async function initDb() {
  const schema = fs.readFileSync(path.join(process.cwd(), "lib/schema.sql"), "utf-8")
  const statements = schema.split(";").filter(s => s.trim())
  for (const stmt of statements) {
    await db.execute(stmt)
  }
}
```

- [ ] **Step 4: Commit**

---

### Task 3: Types Definitions

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create type definitions**

```ts
export interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
  created_at: string
}

export interface Search {
  id: number
  user_id: number
  location: string
  lat: number
  lng: number
  radius: number
  results_count: number
  created_at: string
}

export interface PlaceData {
  id: string
  name: string
  types: string[]
  rating: number
  userRatingCount: number
  priceLevel?: string
  businessStatus: string
  lat: number
  lng: number
  vicinity?: string
  openingHours?: string[]
}

export interface CategoryStat {
  category: string
  count: number
  avgRating: number
  percentage: number
}

export interface Recommendation {
  rank: number
  business: string
  score: number
  reason: string
}

export interface AiAnalysis {
  stats: CategoryStat[]
  overcrowded: string[]
  recommendations: Recommendation[]
}

export interface SearchResult {
  id: number
  search_id: number
  raw_places: PlaceData[]
  ai_analysis: AiAnalysis
  recommendations: Recommendation[]
  created_at: string
}
```

- [ ] **Step 2: Commit**

---

### Task 4: Auth Setup (Auth.js v5)

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Modify: `app/layout.tsx` — add SessionProvider
- Create: `components/SessionWrapper.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/register/page.tsx`
- Create: `app/(auth)/layout.tsx`

- [ ] **Step 1: Create `lib/auth.ts`** — Auth.js config with credentials provider

```ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const result = await db.execute({
          sql: "SELECT * FROM users WHERE email = ?",
          args: [credentials.email as string],
        })
        const user = result.rows[0] as any
        if (!user || !(await compare(credentials.password as string, user.password_hash))) {
          return null
        }
        return { id: String(user.id), email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        (session.user as any).id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
```

- [ ] **Step 2: Create API route** — `app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
```

- [ ] **Step 3: Create SessionWrapper** — `components/SessionWrapper.tsx`

```tsx
"use client"
import { SessionProvider } from "next-auth/react"
export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

- [ ] **Step 4: Login page** — `app/(auth)/login/page.tsx`

```tsx
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
      router.push("/search")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Card className="w-96">
        <CardHeader><CardTitle className="text-2xl text-center">MapIde UMKM</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Masuk</Button>
          </form>
          <p className="text-center mt-4 text-sm">
            Belum punya akun? <a href="/register" className="text-blue-600">Daftar</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Register page** — similar to login but with `email, password, name` fields, hashes password with `bcryptjs`

- [ ] **Step 6: Wrap layout with SessionProvider** in `app/layout.tsx`

```tsx
import SessionWrapper from "@/components/SessionWrapper"
// wrap children in SessionWrapper
```

- [ ] **Step 7: Create (auth)/layout.tsx** — simple centered layout without sidebar

- [ ] **Step 8: Commit**

---

### Task 5: Google Places API Helper

**Files:**
- Create: `lib/places.ts`

- [ ] **Step 1: Create `lib/places.ts`**

```ts
export interface GooglePlace {
  id: string
  name: string
  types: string[]
  rating: number
  userRatingCount: number
  priceLevel?: string
  businessStatus: string
  lat: number
  lng: number
  vicinity?: string
}

export async function searchNearby(lat: number, lng: number, radius: number = 500): Promise<GooglePlace[]> {
  const url = "https://places.googleapis.com/v1/places:searchNearby"
  const payload = {
    locationRestriction: {
      circle: { center: { latitude: lat, longitude: lng }, radius },
    },
    includedTypes: ["restaurant", "cafe", "store", "laundry", "bakery", "beauty_salon", "barber_shop",
      "gym", "pharmacy", "supermarket", "convenience_store"],
    maxResultCount: 20,
    languageCode: "id",
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,places.location,places.formattedAddress,places.regularOpeningHours",
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  return (data.places || []).map((p: any) => ({
    id: p.id,
    name: p.displayName?.text || "",
    types: p.types || [],
    rating: p.rating || 0,
    userRatingCount: p.userRatingCount || 0,
    priceLevel: p.priceLevel,
    businessStatus: p.businessStatus,
    lat: p.location?.latitude || 0,
    lng: p.location?.longitude || 0,
    vicinity: p.formattedAddress || "",
  }))
}
```

- [ ] **Step 2: Commit**

---

### Task 6: OpenRouter AI Helper

**Files:**
- Create: `lib/ai.ts`

- [ ] **Step 1: Create `lib/ai.ts`**

```ts
import { PlaceData, AiAnalysis, Recommendation, CategoryStat } from "@/types"

export async function analyzePlaces(places: PlaceData[], location: string): Promise<AiAnalysis> {
  const prompt = `Analisis peluang usaha UMKM di area "${location}".

Berikut data ${places.length} usaha yang ada di sekitar:

${JSON.stringify(places.map(p => ({
    nama: p.name,
    kategori: p.types,
    rating: p.rating,
    jumlahReview: p.userRatingCount,
    status: p.businessStatus,
  })), null, 2)}

Berikan analisis dalam format JSON SAJA (tanpa markdown, tanpa teks lain):
{
  "stats": [
    { "category": "Kafe", "count": 5, "avgRating": 4.2, "percentage": 25 },
    { "category": "Laundry", "count": 2, "avgRating": 3.8, "percentage": 10 }
  ],
  "overcrowded": ["Kafe", "Restoran"],
  "recommendations": [
    { "rank": 1, "business": "Laundry Kiloan", "score": 85, "reason": "Hanya 2 kompetitor dengan rating rendah" },
    { "rank": 2, "business": "Oleh-oleh Khas", "score": 72, "reason": "Tidak ada kompetitor sejenis" },
    { "rank": 3, "business": "Bengkel Kecil", "score": 65, "reason": "Kompetisi rendah, permintaan stabil" }
  ]
}`

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "deepseek/deepseek-v4-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  })

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}

export async function askAi(question: string, context: { location: string, places: PlaceData[] }) {
  const prompt = `User bertanya: "${question}"

Konteks lokasi: ${context.location}
Data usaha sekitar:
${JSON.stringify(context.places.slice(0, 10), null, 2)}

Jawab dengan ramah dan informatif dalam Bahasa Indonesia.`
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "deepseek/deepseek-v4-flash",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await res.json()
  return data.choices[0].message.content
}
```

- [ ] **Step 2: Commit**

---

### Task 7: Main Search Page (Halaman Utama)

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/search/page.tsx`
- Create: `components/SearchBar.tsx`
- Create: `components/MapView.tsx`
- Create: `components/StatCard.tsx`
- Create: `components/RecommendationCard.tsx`
- Create: `components/AIModal.tsx`
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create `Navbar.tsx`** — top bar with logo, user info, logout

- [ ] **Step 2: Create `app/(dashboard)/layout.tsx`** — Navbar + children

- [ ] **Step 3: Create `components/SearchBar.tsx`** — search form + geocode

- [ ] **Step 4: Create `components/MapView.tsx`** — Google Maps wrapper with markers

- [ ] **Step 5: Create `components/StatCard.tsx`** — category stats with progress bar

- [ ] **Step 6: Create `components/RecommendationCard.tsx`** — recommendation card with medals

- [ ] **Step 7: Create `components/AIModal.tsx`** — chat dialog with AI

- [ ] **Step 8: Create `app/(dashboard)/search/page.tsx`** — main search + results layout

- [ ] **Step 9: Create API route `app/api/places/route.ts`** — search + analyze + save

- [ ] **Step 10: Create API route `app/api/analyze/route.ts`** — Tanya AI endpoint

- [ ] **Step 11: Commit**

---

### Task 8: History Page + PDF Export

**Files:**
- Create: `app/(dashboard)/history/page.tsx`
- Create: `components/PrintPdfButton.tsx`

- [ ] **Step 1: Create history page** — fetch user searches, display cards

- [ ] **Step 2: Create `components/PrintPdfButton.tsx`** — jsPdf export

- [ ] **Step 3: Create API route `app/api/history/route.ts`** — auth-protected history

- [ ] **Step 4: Commit**

---

### Task 9: Admin Dashboard — Overview

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/overview/page.tsx`
- Create: `components/AdminNav.tsx`

- [ ] **Step 1: Create Admin layout** — admin sidebar/nav

- [ ] **Step 2: Create overview page** — stat cards + Recharts chart + pie

- [ ] **Step 3: Create API route `app/api/admin/stats/route.ts`** — aggregate queries

- [ ] **Step 4: Commit**

---

### Task 10: Admin — Users & Reports

**Files:**
- Create: `app/(admin)/users/page.tsx`
- Create: `app/(admin)/reports/page.tsx`

- [ ] **Step 1: Users page** — table with all users + search count + last active

- [ ] **Step 2: Reports page** — search history table with filters + PDF export

- [ ] **Step 3: API route `app/api/admin/users/route.ts`** — fetch users

- [ ] **Step 4: API route `app/api/admin/reports/route.ts`** — fetch all searches

- [ ] **Step 5: Commit**

---

### Task 11: Middleware & Seed Data

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create middleware** — protect /admin and /history routes

- [ ] **Step 2: Create seed script** — insert admin: admin@umkm.com / admin123

- [ ] **Step 3: Commit**

---

### Task 12: Final Polish

- [ ] **Step 1:** Add loading skeletons
- [ ] **Step 2:** Add responsive design
- [ ] **Step 3:** Add error boundaries
- [ ] **Step 4:** Test full flow
- [ ] **Step 5:** Commit
