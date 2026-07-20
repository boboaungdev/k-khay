"use server"

import { signupSchema } from "@/features/auth/schemas/auth.schema"
import { signUpWithPassword } from "@/features/auth/services/auth.service"

export async function signupAction(payload: {
  email: string
  name: string
  username: string
  password: string
  rePassword: string
}) {
  const result = signupSchema.safeParse(payload)

  if (!result.success) {
    return {
      ok: false,
      error: "Invalid signup details",
    } as const
  }

  return signUpWithPassword({
    email: payload.email,
    name: result.data.name,
    username: result.data.username,
    password: result.data.password,
  })
}
