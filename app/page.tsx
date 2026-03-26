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
      <div
        className={cn(
          "flex flex-col items-center gap-4 text-sm",
          imFellEnglish.className
        )}
      >
        <Image
          src={profileImage}
          alt="E. Jalakas"
          width={300}
          height={800}
          className=""
        />
        <h1 className="-mt-10 -ml-40 text-7xl font-bold text-primary">
          E. Jalakas
        </h1>
        <p className="-mr-50 max-w-xl text-lg italic">
          För att mina inre bilder ska komma fram målar jag av objekt och de
          visar sig ofta med mycket energi och färg. Jag inspireras av folk och
          föremål i vardagen och utforskandet av olika tekniker och material.
          Målar med energi och färg för att ge liv i mina tolkningar av
          omvärlden.
        </p>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <ArtCard />
        <ExhibitionCard />
        <CollectionCard />
      </div>
    </div>
  )
}
