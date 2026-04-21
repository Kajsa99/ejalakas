import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createClient } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export default function BreadcrumbHeader() {
  const pathname = usePathname()
  const [dynamicLabels, setDynamicLabels] = useState<Record<number, string>>({})
  const breadcrumbs = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  )

  useEffect(() => {
    const loadLabels = async () => {
      const labels: Record<number, string> = {}
      const supabase = createClient()

      for (let index = 0; index < breadcrumbs.length; index += 1) {
        const segment = breadcrumbs[index]

        if (!/^\d+$/.test(segment) || index === 0) {
          continue
        }

        const parentSegment = breadcrumbs[index - 1]
        const table =
          parentSegment === "collections"
            ? "collection"
            : parentSegment === "exhibitions"
              ? "exhibition"
              : parentSegment

        // [id] pages
        if (
          table !== "collection" &&
          table !== "art" &&
          table !== "exhibition"
        ) {
          continue
        }

        const { data } = await supabase
          .from(table)
          .select("name")
          .eq("id", Number(segment))
          .maybeSingle()

        if (data?.name) {
          labels[index] = data.name
        }
      }

      setDynamicLabels(labels)
    }

    void loadLabels()
  }, [breadcrumbs])

  const breadcrumbItems = breadcrumbs.map((breadcrumb, index) => {
    const href = `/${breadcrumbs.slice(0, index + 1).join("/")}`
    const label = dynamicLabels[index] ?? breadcrumb

    return (
      <div key={`${href}-${index}`} className="flex items-center">
        <BreadcrumbItem>
          <BreadcrumbLink
            href={href}
            className="text-md text-primary uppercase hover:text-primary/80"
          >
            {label}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {index < breadcrumbs.length - 1 && (
          <BreadcrumbSeparator className="text-primary" />
        )}
      </div>
    )
  })
  return (
    <div className="text-md flex items-center gap-2">
      <Breadcrumb>
        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
