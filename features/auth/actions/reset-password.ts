"use server"

import { resetPasswordSchema } from "@/features/auth/schemas/auth.schema"
import { resetUserPassword } from "@/features/auth/services/auth.service"

export async function resetPasswordAction(payload: {
  email: string
  code: string
  password: string
  rePassword: string
}) {
  const result = resetPasswordSchema.safeParse({
    otp: payload.code,
    password: payload.password,
    rePassword: payload.rePassword,
  })

  if (!result.success) {
    return {
      ok: false,
      error: "Invalid reset password details",
    } as const
  }

  return resetUserPassword({
    email: payload.email,
    code: result.data.otp,
    password: result.data.password,
  })
}
