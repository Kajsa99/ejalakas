import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <div className="mx-auto mt-8 mb-20 w-full max-w-2xl border-y border-foreground/15 px-6 py-12">
      <p className="eyebrow text-center text-foreground">Nyhetsbrev</p>
      <h2 className="my-5 text-center font-heading text-3xl font-medium md:text-4xl">
        Håll dig uppdaterad med E. Jalakas nyhetsbrev!
      </h2>
      <form className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="exempel@email.com"
          required
          className="max-w-xs rounded-none border-foreground/25 bg-card px-4"
        />
        <Button type="submit" className="px-4">
          <Mail className="size-4" />
          Prenumerera
        </Button>
      </form>
    </div>
  )
}
