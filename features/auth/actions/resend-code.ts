"use server"

import { sendVerificationCode } from "@/features/auth/services/auth.service"

export async function resendCodeAction(payload: {
  email: string
  type: "signup" | "reset-password"
}) {
  if (!payload.email || !payload.type) {
    return {
      ok: false,
      error: "Email and type are required",
    } as const
  }

  return sendVerificationCode(payload.email, payload.type)
}
