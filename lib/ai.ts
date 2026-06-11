import { PlaceData, AiAnalysis } from "@/types"

export async function analyzePlaces(places: PlaceData[], location: string): Promise<AiAnalysis> {
  const prompt = `Analisis peluang usaha UMKM di area "${location}".

Berikut data ${places.length} usaha yang ada di sekitar:

${JSON.stringify(
  places.map((p) => ({
    nama: p.name,
    kategori: p.types,
    rating: p.rating,
    jumlahReview: p.userRatingCount,
    status: p.businessStatus,
  })),
  null,
  2
)}

Berikan analisis dalam format JSON SAJA (tanpa markdown):
{
  "stats": [
    { "category": "Kafe", "count": 5, "avgRating": 4.2, "percentage": 25 }
  ],
  "overcrowded": ["Kafe"],
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
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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

export async function askAi(question: string, context: { location: string; places: PlaceData[] }) {
  const prompt = `User bertanya: "${question}"

Konteks lokasi: ${context.location}
Data usaha sekitar:
${JSON.stringify(context.places.slice(0, 10), null, 2)}

Jawab dengan ramah dan informatif dalam Bahasa Indonesia.`

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "deepseek/deepseek-v4-flash",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await res.json()
  return data.choices[0].message.content
}
