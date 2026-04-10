import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ContactForm() {
  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <Card className="bg-amber-50 p-4">
        <CardHeader>
          <CardTitle className="mt-4 text-lg font-medium">
            Du kan även kontakta mig via formuläret
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="mx-auto flex max-w-sm flex-col gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Namn *</Label>
              <Input id="name" name="name" type="text" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
            </div>
            <Input id="phone" name="phone" type="tel" />
            <div className="grid gap-2">
              <Label htmlFor="message">Meddelande</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit">Skicka</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
