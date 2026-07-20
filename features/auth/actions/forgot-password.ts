"use server"

import { sendVerificationCode } from "@/features/auth/services/auth.service"

export async function forgotPasswordAction(email: string) {
  if (!email) {
    return {
      ok: false,
      error: "Email is required",
    } as const
  }

  return sendVerificationCode(email, "reset-password")
}
