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
    <article className="outfit-uniquifier mt-6 w-full max-w-md overflow-hidden bg-amber-50 dark:bg-zinc-900">
      <div className="relative">
        <Link href={`/art/${id}`}>
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="block h-[240px] w-full object-cover"
          />
        </Link>
        <div className="absolute right-2 bottom-2 z-10">
          <ForSaleBadge sold={status} />
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="outfit-uniquifier text-lg">{name}</h2>
          <p className="text-md text-muted-foreground">{year}</p>
        </div>
        <div className="flex w-full justify-end">
          <Link
            href={`/art/${id}`}
            className="mt-2 inline-block text-sm underline-offset-4 hover:text-primary hover:underline"
          >
            Se detaljer
          </Link>
        </div>
      </div>
    </article>
  )
}
