import Image from "next/image"
import { IM_Fell_English } from "next/font/google"
import { cn } from "@/lib/utils"
import ArtCard from "@/components/art-card"
import ExhibitionCard from "@/components/exhibition-card"
import CollectionCard from "@/components/collection-card"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import Newsletter from "@/components/newletter"

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

export default async function HomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const profileImageUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.profile}`

  return (
    <div className="animate-page-in flex min-h-screen w-full max-w-full min-w-0 flex-col items-center gap-4 overflow-x-hidden px-4 pt-20 sm:px-8">
      <div className="mt-8 flex w-full max-w-6xl min-w-0 flex-col items-center gap-5 px-1 text-sm sm:px-0">
        <Image
          src={profileImageUrl}
          alt="E. Jalakas"
          width={300}
          height={800}
          className="animate-float-in h-auto w-full max-w-[360px] object-contain mix-blend-multiply dark:mix-blend-normal"
          priority
          unoptimized
        />
        <h1
          className={cn(
            "page-heading mx-auto max-w-full text-center font-bold text-primary sm:text-6xl md:mx-0 md:-ml-48 md:text-left",
            imFellEnglish.className
          )}
        >
          E. Jalakas
        </h1>
        <p
          className={cn(
            "max-w-lg px-1 text-center font-serif text-base leading-relaxed text-foreground/75 md:text-left",
            imFellEnglish.className
          )}
        >
          Målar med energi och färg för att ge liv i mina tolkningar av
          omvärlden. Jag visar er hur jag ser den och hur färg kan förvandla en
          bild till en annan.
        </p>
      </div>
      <div className="mb-16 grid w-full max-w-6xl min-w-0 grid-cols-1 gap-4 px-0 py-12 md:grid-cols-3 md:gap-6">
        <div className="reveal-card reveal-delay-1">
          <ArtCard />
        </div>
        <div className="reveal-card reveal-delay-2">
          <ExhibitionCard />
        </div>
        <div className="reveal-card reveal-delay-3">
          <CollectionCard />
        </div>
      </div>
      <Newsletter />
    </div>
  )
}
