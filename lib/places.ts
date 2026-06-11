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
    includedTypes: [
      "restaurant", "cafe", "store", "laundry", "bakery", "beauty_salon",
      "barber_shop", "gym", "pharmacy", "supermarket", "convenience_store",
    ],
    maxResultCount: 20,
    languageCode: "id",
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.types,places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,places.location,places.formattedAddress",
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
