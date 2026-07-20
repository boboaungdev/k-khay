"use server"

import { signinSchema } from "@/features/auth/schemas/auth.schema"
import { signInWithPassword } from "@/features/auth/services/auth.service"

export async function signinAction(payload: { email: string; password: string }) {
  const result = signinSchema.safeParse(payload)

  if (!result.success) {
    return {
      ok: false,
      error: "Invalid email or password",
    } as const
  }

  return signInWithPassword(result.data.email, result.data.password)
}
