"use server"

import { otpSchema } from "@/features/auth/schemas/auth.schema"
import { verifyEmailCode } from "@/features/auth/services/auth.service"

export async function verifyEmailAction(payload: {
  email: string
  code: string
}) {
  const result = otpSchema.safeParse({
    otp: payload.code,
  })

  if (!result.success) {
    return {
      ok: false,
      error: "Verification code must be 6 digits.",
    } as const
  }

  return verifyEmailCode(payload.email, payload.code)
}
