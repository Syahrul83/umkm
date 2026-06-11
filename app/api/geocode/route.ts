import { NextResponse } from "next/server"

async function forwardGeocode(location: string) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.formattedAddress",
    },
    body: JSON.stringify({ textQuery: location, maxResultCount: 1, languageCode: "id" }),
  })
  const data = await res.json()
  const place = data.places?.[0]
  if (!place) return null
  return {
    lat: place.location.latitude,
    lng: place.location.longitude,
    address: place.formattedAddress,
    name: place.displayName?.text,
  }
}

async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({
      locationRestriction: {
        circle: { center: { latitude: lat, longitude: lng }, radius: 50 },
      },
      maxResultCount: 1,
      languageCode: "id",
    }),
  })
  const data = await res.json()
  const place = data.places?.[0]
  return {
    lat,
    lng,
    address: place?.formattedAddress || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    name: place?.displayName?.text || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { location, lat, lng } = body

    if (lat !== undefined && lng !== undefined) {
      const result = await reverseGeocode(lat, lng)
      return NextResponse.json(result)
    }

    if (!location) {
      return NextResponse.json({ error: "Lokasi tidak ditemukan" }, { status: 400 })
    }

    const result = await forwardGeocode(location)
    if (!result) {
      return NextResponse.json({ error: "Lokasi tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Gagal mencari lokasi" }, { status: 500 })
  }
}
