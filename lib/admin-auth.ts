import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"

const ADMIN_ROLES = new Set(["admin", "superadmin"])
const STATIC_ADMIN_EMAILS = new Set(["ejalakas@gmail.com"])

function normalizeRoleValues(value: unknown): string[] {
  if (typeof value === "string") {
    return [value.toLowerCase()]
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.toLowerCase())
  }

  return []
}

export function isAdminFromClaims(claims: Record<string, unknown> | null | undefined) {
  if (!claims) return false

  const appMetadata =
    claims.app_metadata && typeof claims.app_metadata === "object"
      ? (claims.app_metadata as Record<string, unknown>)
      : {}
  const userMetadata =
    claims.user_metadata && typeof claims.user_metadata === "object"
      ? (claims.user_metadata as Record<string, unknown>)
      : {}

  const candidateRoles = [
    ...normalizeRoleValues(claims.role),
    ...normalizeRoleValues(appMetadata.role),
    ...normalizeRoleValues(appMetadata.roles),
    ...normalizeRoleValues(userMetadata.role),
    ...normalizeRoleValues(userMetadata.roles),
  ]

  return candidateRoles.some((role) => ADMIN_ROLES.has(role))
}

export async function isAdminFromDatabase(
  supabase: SupabaseClient,
  userId: string
) {
  const candidates: Array<{ table: string; column: string }> = [
    { table: "users", column: "user_id" },
    { table: "admin", column: "user_id" },
    { table: "admins", column: "user_id" },
    { table: "users", column: "id" },
  ]

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from(candidate.table)
      .select("role")
      .eq(candidate.column, userId)
      .maybeSingle()

    if (!error && data) {
      const hasRole = normalizeRoleValues((data as { role?: unknown }).role).some(
        (role) => ADMIN_ROLES.has(role)
      )

      if (hasRole) {
        return true
      }
    }
  }

  return false
}

export async function isAdminUser(
  supabase: SupabaseClient,
  userId: string,
  claims: Record<string, unknown> | null | undefined,
  userEmail?: string | null
) {
  const normalizedEmail = (userEmail ?? "").trim().toLowerCase()
  if (normalizedEmail) {
    const envAllowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
    const allowlistedEmails = new Set([...STATIC_ADMIN_EMAILS, ...envAllowlist])

    if (allowlistedEmails.has(normalizedEmail)) {
      return true
    }
  }

  if (isAdminFromClaims(claims)) {
    return true
  }

  return isAdminFromDatabase(supabase, userId)
}

export async function requireAdmin(
  supabase: SupabaseClient,
  forbiddenMessage = "Forbidden"
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const { data, error: claimsError } = await supabase.auth.getClaims()
  const claims = !claimsError
    ? ((data?.claims ?? null) as Record<string, unknown> | null)
    : null

  const hasAdminAccess = await isAdminUser(supabase, user.id, claims, user.email)

  if (!hasAdminAccess) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: forbiddenMessage }, { status: 403 }),
    }
  }

  return { ok: true as const, user }
}
