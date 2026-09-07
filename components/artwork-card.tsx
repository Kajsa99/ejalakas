import Image from "next/image"
import Link from "next/link"
import { ForSaleBadge } from "@/components/for-sale-badge"

interface ArtworkCardProps {
  id: number
  name: string
  image: string
  year: number
  status: boolean
}

export default function ArtworkCard({
  id,
  name,
  image,
  year,
  status,
}: ArtworkCardProps) {
  return (
    <article className="group w-full max-w-md bg-background transition-transform duration-500 focus-within:-translate-y-2 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Link
          href={`/art/${id}`}
          className="block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        >
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="block aspect-[4/3] h-auto w-full object-cover transition-transform duration-700 ease-out group-focus-within:scale-105 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100" />
        <div className="pointer-events-none absolute right-3 bottom-3 z-10 opacity-0 transition-opacity duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
          <ForSaleBadge sold={status} />
        </div>
      </div>
      <div className="flex min-h-28 flex-col items-start gap-3 border-t border-foreground/15 px-1 pt-4 pb-3">
        <div className="min-w-0">
          <h2 className="font-heading text-2xl leading-tight transition-transform duration-300 group-focus-within:translate-x-1 group-hover:translate-x-1">
            {name}
          </h2>
          <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {year}
          </p>
        </div>
        <div className="flex min-h-10 w-full items-center">
          <Link
            href={`/art/${id}`}
            className="artwork-details-link translate-y-2 py-2 text-base font-medium opacity-0 transition-all duration-500 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Se detaljer
          </Link>
        </div>
      </div>
    </article>
  )
}
