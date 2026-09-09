import Image from "next/image"
import { STORAGE_BUCKET, STORAGE_IMAGE_PATHS } from "@/lib/storage-image-paths"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const aboutProfileImage = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.aboutProfile}`
const aboutPaintImage = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.aboutProfile2}`
const aboutPaintImage2 = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_IMAGE_PATHS.aboutProfile3}`

export default function Page() {
  return (
    <div className="site-page">
      <div className="site-intro">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / Om</p>
          <h1 className="page-heading">Jaget, naturen och människan</h1>
        </div>
      </div>
      <div className="merriweather-long-text w-full pt-12 text-sm">
        <div className="flex w-full min-w-0 flex-col gap-16">
          <div className="w-full max-w-245 min-w-0 md:grid md:grid-cols-2 md:items-center md:gap-8">
            <div className="relative aspect-4/5 min-h-55 w-full overflow-hidden sm:aspect-auto sm:h-95 md:h-125">
              <Image
                src={aboutProfileImage}
                alt="profil med blommor"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 490px"
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="mt-4 px-2 py-4 leading-loose sm:px-4 md:mt-0 md:p-8">
              <h2 className="mb-4 font-heading text-3xl leading-tight text-foreground">
                Jag, E. Jalakas
              </h2>
              <p className="px-1 py-2 text-sm leading-loose text-foreground/75 sm:p-4">
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
          <div className="w-full max-w-245 min-w-0 py-4 md:grid md:grid-cols-2 md:items-center md:gap-8">
            <div className="mt-4 px-2 py-4 leading-loose sm:px-4 md:mt-0 md:p-8">
              <h2 className="mb-4 font-heading text-3xl leading-tight text-foreground">
                Naturen
              </h2>
              <p className="px-1 py-2 text-sm leading-loose text-foreground/75 sm:p-4">
                När jag tänker på hur jag skapar och vad mina processer är så
                upplever jag konsten som ett uttryck av det jag ser och känner.
                Jag återskapa vad jag ser och försöker attförmedla känslan i det
                ögonblicket. Min konst är ett uttryck av känslor och färg och är
                menat att synas och delas.{" "}
              </p>
              <p className="mt-4 px-1 py-2 text-sm leading-loose text-foreground/75 sm:p-4">
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
            <div className="relative mx-auto mt-4 aspect-5/4 min-h-55 w-full max-w-100 overflow-hidden sm:mt-0 sm:aspect-auto sm:h-85 md:ml-auto md:h-100">
              <Image
                src={aboutPaintImage}
                alt="målar utomhus"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                loading="eager"
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="w-full max-w-245 min-w-0 py-4 md:grid md:grid-cols-2 md:items-center md:gap-8">
            <div className="relative aspect-4/5 min-h-55 w-full overflow-hidden sm:aspect-auto sm:h-95 md:h-125">
              <Image
                src={aboutPaintImage2}
                alt="måla vid havet"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 490px"
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="mt-4 px-2 py-4 leading-loose sm:px-4 md:mt-0 md:p-8">
              <h2 className="mb-4 font-heading text-3xl leading-tight text-foreground">
                Människan
              </h2>
              <p className="px-1 py-2 text-sm leading-loose text-foreground/75 sm:p-4">
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
