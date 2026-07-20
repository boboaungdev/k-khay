"use server"

import { saveAccountAvatar } from "@/features/account/services/account.service"

export async function uploadAvatarAction(formData: FormData) {
  return saveAccountAvatar(formData)
}
