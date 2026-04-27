import { Badge } from "@/components/ui/badge"

interface ArtStatusBadgeProps {
  sold?: boolean
}

export function ArtStatusBadge({ sold = false }: ArtStatusBadgeProps) {
  if (sold) {
    return (
      <Badge variant="default" className="text-sm">
        Såld
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="text-sm text-zinc-900 dark:text-zinc-100"
    >
      Till salu
    </Badge>
  )
}
