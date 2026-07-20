"use server"

import { saveAccountProfile } from "@/features/account/services/account.service"

export async function editProfileAction(payload: {
  id: string
  name: string
  username: string
}) {
  if (!payload.id || !payload.name || !payload.username) {
    return {
      ok: false,
      error: "Missing required fields",
    } as const
  }

  return saveAccountProfile(payload)
}
