const COURSE_SIGN_UP_MESSAGE =
  /^Kursanmälan\r?\nAntal deltagare: (\d+)\r?\n\r?\nMeddelande från deltagare:\r?\n([\s\S]*)$/

export function formatCourseSignUpMessage(
  participantCount: number,
  userMessage: string
) {
  return `Kursanmälan\nAntal deltagare: ${participantCount}\n\nMeddelande från deltagare:\n${userMessage || "-"}`
}

export function parseCourseSignUpMessage(message: string) {
  const match = message.match(COURSE_SIGN_UP_MESSAGE)
  if (!match) {
    const trimmed = message.trim()
    return {
      participantCount: null,
      userMessage: trimmed.length > 0 ? trimmed : null,
    }
  }

  const userMessage = match[2]?.trim() ?? ""
  return {
    participantCount: Number(match[1]),
    userMessage:
      userMessage.length > 0 && userMessage !== "-" ? userMessage : null,
  }
}
