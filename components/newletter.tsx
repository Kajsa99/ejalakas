import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <div className="mx-auto mt-16 mb-20 w-full max-w-lg">
      <h2 className="my-8 text-center text-2xl font-medium">
        Håll dig uppdaterad med mitt nyhetsbrev!
      </h2>
      <form className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="exempel@email.com"
          required
          className="max-w-xs px-4"
        />
        <Button type="submit" className="px-10">
          <Mail className="size-4" />
          Skicka
        </Button>
      </form>
    </div>
  )
}
