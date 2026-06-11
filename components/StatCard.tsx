import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface StatCardProps {
  category: string
  count: number
  avgRating: number
  percentage: number
  isOvercrowded?: boolean
}

export default function StatCard({ category, count, avgRating, percentage, isOvercrowded }: StatCardProps) {
  return (
    <div className="border rounded-lg p-3 space-y-1">
      <div className="flex justify-between items-center">
        <span className="font-medium">{category}</span>
        {isOvercrowded && <Badge variant="destructive">Padat</Badge>}
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{count} usaha</span>
        <span>⭐ {avgRating.toFixed(1)}</span>
      </div>
    </div>
  )
}
