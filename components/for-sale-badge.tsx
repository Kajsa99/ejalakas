import { Badge } from "./ui/badge"

interface ForSaleBadgeProps {
  sold?: boolean
}

export function ForSaleBadge({ sold = false }: ForSaleBadgeProps) {
  return (
    <Badge
      variant={sold ? "default" : "outline"}
      className="text-md text-white"
    >
      {sold ? "Såld" : "Till salu"}
    </Badge>
  )
}
