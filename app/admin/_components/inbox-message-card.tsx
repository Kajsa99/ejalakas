import type { ReactNode } from "react"

import { parseCourseSignUpMessage } from "@/lib/course-sign-up-message"

export interface InboxMessage {
  id: string
  name: string
  email: string
  phone: string | null
  art_id: string | null
  art_name: string | null
  course_id: string | null
  course_name: string | null
  message: string
  created_at: string
}
function formatMessageDate(isoDate: string) {
  return new Date(isoDate).toLocaleString("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function SectionDivider() {
  return (
    <div className="px-4" role="presentation" aria-hidden>
      <div className="mx-auto h-px w-4/5 bg-border" />
    </div>
  )
}

function ContactField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-base text-foreground">{children}</dd>
    </div>
  )
}

export function InboxMessageCard({ message }: { message: InboxMessage }) {
  const hasArt = Boolean(message.art_id)
  const hasCourse = Boolean(message.course_id)
  const courseDetails = hasCourse
    ? parseCourseSignUpMessage(message.message)
    : null
  const participantCount = courseDetails?.participantCount ?? null
  const userMessage = hasCourse
    ? courseDetails?.userMessage
    : message.message.trim() || null
  const showParticipants = hasCourse && participantCount != null
  const showMessage = Boolean(userMessage)

  return (
    <article className="overflow-hidden rounded-lg border bg-card text-base shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 bg-muted/30 px-4 py-4">
        <div className="min-w-0 space-y-2">
          {hasArt ? (
            <p className="text-lg leading-tight font-semibold text-red-900">
              {message.art_name ? (
                <span>{message.art_name}</span>
              ) : (
                <span>Konstverk</span>
              )}
              <span className="font-normal text-red-800/90">
                {" "}
                (id {message.art_id})
              </span>
            </p>
          ) : null}
          {hasCourse ? (
            <p className="text-lg leading-tight font-semibold text-amber-900">
              {message.course_name ? `${message.course_name}` : "Kurs"}
            </p>
          ) : null}
          {!hasArt && !hasCourse ? (
            <h3 className="text-lg leading-tight font-semibold">
              {message.name}
            </h3>
          ) : (
            <p className="text-base text-muted-foreground">
              <span className="font-medium text-foreground">Från:</span>{" "}
              {message.name}
            </p>
          )}
        </div>
        <time
          dateTime={message.created_at}
          className="shrink-0 text-sm text-muted-foreground"
        >
          {formatMessageDate(message.created_at)}
        </time>
      </header>

      <SectionDivider />

      <dl className="flex flex-row flex-wrap items-start gap-x-10 gap-y-4 px-4 pb-4">
        <ContactField label="E-post">
          <a
            href={`mailto:${message.email}`}
            className="break-all text-primary underline-offset-4 hover:underline"
          >
            {message.email}
          </a>
        </ContactField>
        {message.phone ? (
          <ContactField label="Telefon">
            <a
              href={`tel:${message.phone.replace(/\s/g, "")}`}
              className="hover:underline"
            >
              {message.phone}
            </a>
          </ContactField>
        ) : null}
      </dl>

      {hasCourse && (showParticipants || showMessage) ? (
        <>
          <SectionDivider />
          <div className="flex flex-row items-start gap-8 px-4 py-4">
            {showParticipants ? (
              <div className="w-28 shrink-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Antal deltagare
                </p>
                <p className="mt-1 text-2xl font-semibold text-amber-950 tabular-nums">
                  {participantCount}
                </p>
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Meddelande
              </p>
              {showMessage ? (
                <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
                  &quot;{userMessage}&quot;
                </p>
              ) : (
                <p className="text-base text-muted-foreground">—</p>
              )}
            </div>
          </div>
        </>
      ) : showMessage ? (
        <>
          <SectionDivider />
          <div className="px-4 py-4">
            <p className="mb-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Meddelande
            </p>
            <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
              &quot;{userMessage}&quot;
            </p>
          </div>
        </>
      ) : null}
    </article>
  )
}
