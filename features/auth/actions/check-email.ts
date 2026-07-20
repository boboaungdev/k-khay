"use server"

import { checkEmailExists } from "@/features/auth/services/auth.service"

export async function checkEmailAction(email: string) {
  return checkEmailExists(email)
}
