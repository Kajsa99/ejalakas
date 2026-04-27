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
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-amber-100 p-6 dark:bg-zinc-950">
      <div className="mt-20 flex flex-col items-center gap-4 text-sm">
        <Image
          src={profileImageUrl}
          alt="E. Jalakas"
          width={300}
          height={800}
          className="h-auto w-[300px]"
          priority
          unoptimized
        />
        <h1
          className={cn(
            "-mt-10 -ml-40 text-7xl font-bold text-primary",
            imFellEnglish.className
          )}
        >
          E. Jalakas
        </h1>
        <p
          className={cn(
            "text-md max-w-lg text-center text-primary md:m-4 lg:-mr-70",
            imFellEnglish.className
          )}
        >
          &quot;Målar med energi och färg för att ge liv i mina tolkningar av
          omvärlden. Jag visar er hur jag ser den och hur färg kan förvandla en
          bild till en annan.&quot;
        </p>
      </div>
      <div className="mb-20 flex flex-col items-center justify-center gap-10 p-10 md:flex-row">
        <ArtCard />
        <ExhibitionCard />
        <CollectionCard />
      </div>
      <Newsletter />
    </div>
  )
}
