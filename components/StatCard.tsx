import { Badge } from "@/components/ui/badge"

interface StatCardProps {
  category: string
  count: number
  avgRating: number
  percentage: number
  isOvercrowded?: boolean
}

export default function StatCard({ category, count, avgRating, percentage, isOvercrowded }: StatCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium">{category}</span>
        {isOvercrowded ? (
          <Badge variant="destructive" className="text-xs">Padat</Badge>
        ) : (
          <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded">Terbuka</span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className={`h-2 rounded-full ${isOvercrowded ? "bg-destructive" : "bg-secondary"}`}
          style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{count} usaha</span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {avgRating.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
