import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { isAdminUser } from "@/lib/admin-auth"
import { AdminMenu } from "./_components/admin-menu"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  const { data, error: claimsError } = await supabase.auth.getClaims()
  const claims = !claimsError
    ? ((data?.claims ?? null) as Record<string, unknown> | null)
    : null
  const hasAccess =
    !userError &&
    !!user &&
    (await isAdminUser(supabase, user.id, claims, user.email))

  if (!hasAccess) {
    redirect("/")
  }

  return (
    <div className="w-full bg-white">
      <AdminMenu />
    </div>
  )
}
