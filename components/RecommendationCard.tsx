import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecommendationCardProps {
  rank: number
  business: string
  score: number
  reason: string
}

const medals = ["🥇", "🥈", "🥉"]

export default function RecommendationCard({ rank, business, score, reason }: RecommendationCardProps) {
  return (
    <Card className={`border-l-4 ${rank === 1 ? "border-l-green-500" : rank === 2 ? "border-l-blue-500" : "border-l-yellow-500"}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{medals[rank - 1]}</span>
          <span className="font-semibold">{business}</span>
          <Badge variant="secondary" className="ml-auto">{score}/100</Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{reason}</p>
      </CardContent>
    </Card>
  )
}
