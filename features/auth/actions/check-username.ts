"use server"

import { checkUsernameAvailable } from "@/features/auth/services/auth.service"

export async function checkUsernameAction(username: string, email: string) {
  return checkUsernameAvailable(username, email)
}
