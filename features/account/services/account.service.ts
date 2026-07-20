import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

import { R2 } from "@/constatnts"
import { r2 } from "@/lib/r2"
import {
  findAccountAvatar,
  findAccountUsernameOwner,
  updateAccountAvatar,
  updateAccountProfile,
} from "@/features/account/repositories/account.repository"

export async function checkAccountUsernameAvailable(
  username: string,
  email: string
) {
  const user = await findAccountUsernameOwner(username.toLowerCase())

  if (!user) {
    return {
      available: true,
    }
  }

  return {
    available: user.email === email.toLowerCase() && !user.emailVerified,
  }
}

export async function saveAccountProfile(payload: {
  id: string
  name: string
  username: string
}) {
  const username = payload.username.toLowerCase()
  const existingUser = await findAccountUsernameOwner(username)

  if (existingUser && existingUser.id !== payload.id) {
    return {
      ok: false,
      error: "Username is already taken",
    } as const
  }

  const user = await updateAccountProfile({
    ...payload,
    username,
  })

  return {
    ok: true,
    user,
  } as const
}

export async function saveAccountAvatar(formData: FormData) {
  const id = formData.get("id") as string | null
  const avatar = formData.get("avatar") as File | null

  if (!id || !avatar) {
    return {
      ok: false,
      error: "Avatar is required",
    } as const
  }

  if (!avatar.type.startsWith("image/")) {
    return {
      ok: false,
      error: "Only image files are allowed",
    } as const
  }

  if (avatar.size > 5 * 1024 * 1024) {
    return {
      ok: false,
      error: "Avatar must be smaller than 5 MB",
    } as const
  }

  const existingUser = await findAccountAvatar(id)
  const oldAvatar = existingUser?.avatar
  const extension = avatar.name.split(".").pop()?.toLowerCase() ?? "png"
  const key = `avatars/${id}/${id}-${Date.now()}.${extension}`
  const buffer = Buffer.from(await avatar.arrayBuffer())

  await r2.send(
    new PutObjectCommand({
      Bucket: R2.R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: avatar.type,
    })
  )

  const avatarUrl = `${R2.R2_PUBLIC_URL}/${key}`
  const user = await updateAccountAvatar(id, avatarUrl)

  if (oldAvatar) {
    try {
      const oldKey = oldAvatar.replace(`${R2.R2_PUBLIC_URL}/`, "")

      await r2.send(
        new DeleteObjectCommand({
          Bucket: R2.R2_BUCKET,
          Key: oldKey,
        })
      )
    } catch (error) {
      console.error("Failed to delete old avatar:", error)
    }
  }

  return {
    ok: true,
    user,
  } as const
}
