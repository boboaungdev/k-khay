"use server"

import { checkAccountUsernameAvailable } from "@/features/account/services/account.service"

export async function checkAccountUsernameAction(
  username: string,
  email: string
) {
  return checkAccountUsernameAvailable(username, email)
}
