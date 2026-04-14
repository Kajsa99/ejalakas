import BuyArtForm from "./buy-art-form"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function BuyArtPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: artwork } = await supabase
    .from("art")
    .select("name")
    .eq("id", Number(id))
    .single()

  if (!artwork) {
    notFound()
  }

  return (
    <div className="mx-auto my-20 flex w-full max-w-2xl flex-col items-center gap-6 bg-amber-50 p-6">
      <div className="mx-6 text-center">
        <h2 className="my-4 text-2xl font-bold">Köp tavla: {artwork.name}</h2>
        <div className="space-y-4 pb-4 text-center">
          <h2 className="text-md my-4 font-bold">Köpvillkor</h2>
          <ol className="list-inside space-y-4 text-left text-sm leading-loose">
            <li>
              För att köpa en tavla skickar du först en förfrågan via formuläret
              eller kontaktar mig på mejl eller telefon. Jag kommer att kontakta
              dig för att avtala pris och leverans.
            </li>
            <li>
              Efter avtal har du 14 dagar på dig att betala för tavlan.
              <strong>
                Om du inte betalar inom 14 dagar kommer tavlan att säljas till
                nästa köpare.
              </strong>
            </li>
            <li>Betalningar sker via Swish eller banköverföring.</li>
          </ol>
        </div>
        <div className="flex w-full flex-col gap-2 py-4">
          <p className="text-md">Kontakta mig på</p>
          <Link
            href="mailto:elisabetsjalakas@gmail.com"
            className="text-primary hover:underline"
          >
            elisabetsjalakas@gmail.com
          </Link>{" "}
          eller telefon{" "}
          <Link href="tel:0707297220" className="text-primary hover:underline">
            070-729 72 20
          </Link>
        </div>
        <BuyArtForm artworkId={Number(id)} />
      </div>
    </div>
  )
}
