import Image from "next/image"
import profileImage from "./(photos)/image2.jpeg"
import { IM_Fell_English } from "next/font/google"
import { cn } from "@/lib/utils"
import ArtCard from "@/components/art-card"
import ExhibitionCard from "@/components/exhibition-card"
import CollectionCard from "@/components/collection-card"

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

export default async function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex flex-col items-center gap-4 text-sm">
        <Image src={profileImage} alt="E. Jalakas" width={300} height={800} />
        <h1
          className={cn(
            "-mt-10 -ml-40 text-7xl font-bold text-primary",
            imFellEnglish.className
          )}
        >
          E. Jalakas
        </h1>
        <p className="text-md -mr-70 max-w-xl">
          För att mina inre bilder ska komma fram målar jag av objekt och de
          visar sig ofta med mycket energi och färg. Målar med energi och färg
          för att ge liv i mina tolkningar av omvärlden
        </p>
      </div>
      <div className="flex flex-row items-center justify-center gap-10 p-10">
        <ArtCard />
        <ExhibitionCard />
        <CollectionCard />
      </div>
    </div>
  )
}
