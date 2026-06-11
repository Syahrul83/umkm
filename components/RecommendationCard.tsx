import { Card, CardContent } from "@/components/ui/card"

interface RecommendationCardProps {
  rank: number
  business: string
  score: number
  reason: string
}

export default function RecommendationCard({ rank, business, score, reason }: RecommendationCardProps) {
  const borderColor = rank === 1 ? "border-l-secondary" : "border-l-primary"

  return (
    <div className={`p-4 border-l-4 ${borderColor} bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-all cursor-pointer`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-base">{business}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded text-white ${rank === 1 ? "bg-secondary" : "bg-primary"}`}>
          {score}/100
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{reason}</p>
    </div>
  )
}
