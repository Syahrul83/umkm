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
