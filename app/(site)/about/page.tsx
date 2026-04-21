import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"
import { cn } from "@/lib/utils"
import { IM_Fell_English } from "next/font/google"

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const aboutProfileImage = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.aboutProfile}`
const aboutPaintImage = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.aboutProfile2}`
const aboutPaintImage2 = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.aboutProfile3}`

export default function Page() {
  return (
    <div className="my-20 flex flex-col items-center p-6">
      <div className="merriweather-long-text mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-4 text-sm">
        <div className="flex flex-col items-center gap-8 bg-amber-50">
          <h1
            className={cn(
              "mt-10 -ml-10 text-3xl font-bold text-primary",
              imFellEnglish.className
            )}
          >
            Jaget, naturen och människan
          </h1>
          <div className="w-full max-w-[980px] md:grid md:grid-cols-2 md:items-center md:gap-8">
            <div className="relative h-[500px] overflow-hidden">
              <Image
                src={aboutProfileImage}
                alt="profil med blommor"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 500px"
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="mt-4 p-8 leading-loose md:mt-0">
              <h2
                className={cn(
                  "mb-4 text-lg font-bold text-primary",
                  imFellEnglish.className
                )}
              >
                Jag, E.Jalakas
              </h2>
              <p className="p-4 text-sm leading-loose text-black">
                Mitt namn är Elisabet Jalakas Palmén och jag är uppvuxen och
                bosatt i Lindome, Västra Götaland. Skapandet alltid varit en
                stor del av mitt liv. När jag växte upp så var det ett delat
                familjeintresse såsom måla, fotografera, sy, virka, sticka och
                uppmuntrat till det kreativa skapandet så långt jag kan minnas.
                Jag själv är därför väldigt bred i min kompetens och har
                färdigheter inom många olika områden inom det kreativa
                skapandet.
              </p>
            </div>
          </div>
          <div className="w-full max-w-[980px] py-4 md:grid md:grid-cols-2 md:items-center md:gap-8">
            <div className="mt-4 p-8 leading-loose md:mt-0">
              <h2
                className={cn(
                  "mb-4 text-lg font-bold text-primary",
                  imFellEnglish.className
                )}
              >
                Naturen
              </h2>
              <p className="p-4 text-sm leading-loose text-black">
                När jag tänker på hur jag skapar och vad mina processer är så
                upplever jag konsten som ett uttryck av det jag ser och känner.
                Jag återskapa vad jag ser och försöker attförmedla känslan i det
                ögonblicket. Min konst är ett uttryck av känslor och färg och är
                menat att synas och delas.{" "}
              </p>
              <p className="mt-4 p-4 text-sm leading-loose text-black">
                I mina kollektioner så kan man se hur jag fokuserar på vissa
                känslor och former för att fånga in ögonblicket. Jag testar och
                vågar mig fram och det är inte alltid man blir nöjd med all sina
                försök. Då försöker jag lite till. Jag är ingen perfektionist,
                jag studerar kritiskt min egna konst och gör gång på gång nya
                försök tills jag blir nöjd. Ibland är en överjobbad tavla
                problemet till att man inte blir nöjd, därför måste man lära sig
                vart gränsen går.
              </p>
            </div>
            <div className="relative ml-auto h-[400px] w-full max-w-[400px] overflow-hidden">
              <Image
                src={aboutPaintImage}
                alt="målar utomhus"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 500px"
                loading="eager"
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="w-full max-w-[980px] py-4 md:grid md:grid-cols-2 md:items-center md:gap-8">
            <div className="relative h-[500px] overflow-hidden">
              <Image
                src={aboutPaintImage2}
                alt="måla vid havet"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 500px"
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="mt-4 p-8 leading-loose md:mt-0">
              <h2
                className={cn(
                  "mb-4 text-lg font-bold text-primary",
                  imFellEnglish.className
                )}
              >
                Människan
              </h2>
              <p className="p-4 text-sm leading-loose text-black">
                Jag inspireras av folk och föremål i vardagen och utforskandet
                av olika tekniker och material. Jag sitter ofta och målar av
                personer i min omgivning, snabbt och spontant. Det blir ett mer
                levande sätt att skapa och jag sitter gärna med tusch och litet
                ritblock som jag kan ta med mig.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
