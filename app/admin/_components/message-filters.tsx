"use client"

import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface MessageFilters {
  sortBy: "newest" | "oldest" | "name"
  onlyWithArtId: boolean
}

interface MessageFiltersBarProps {
  onChange: (filters: MessageFilters) => void
}

export function MessageFiltersBar({ onChange }: MessageFiltersBarProps) {
  const [filters, setFilters] = useState<MessageFilters>({
    sortBy: "newest",
    onlyWithArtId: false,
  })

  const updateFilters = (next: Partial<MessageFilters>) => {
    const updated = { ...filters, ...next }
    setFilters(updated)
    onChange(updated)
  }

  return (
    <div className="w-full p-3">
      <div className="flex flex-row items-center justify-end gap-4">
        <Label className="flex min-w-40 flex-col items-start gap-2 text-sm">
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              updateFilters({ sortBy: value ?? "newest" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Välj sortering" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Nyast först</SelectItem>
              <SelectItem value="oldest">Äldst först</SelectItem>
              <SelectItem value="name">Namn (A-Ö)</SelectItem>
            </SelectContent>
          </Select>
        </Label>

        <Label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={filters.onlyWithArtId}
            onCheckedChange={(checked) =>
              updateFilters({ onlyWithArtId: Boolean(checked) })
            }
          />
          Endast köp
        </Label>
      </div>
    </div>
  )
}
