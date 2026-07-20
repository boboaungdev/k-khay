import { prisma } from "@/lib/prisma"
import type { EmailVerificationType } from "@/lib/generated/prisma/enums"

export type PublicUser = {
  id: string
  email: string
  username: string
  name: string
  emailVerified: boolean
  avatar?: string
}

function toPublicUser(user: {
  id: string
  email: string
  username: string
  name: string
  emailVerified: boolean
  avatar: string | null
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    emailVerified: user.emailVerified,
    avatar: user.avatar ?? undefined,
  }
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findVerifiedUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
      emailVerified: true,
    },
    select: {
      id: true,
    },
  })
}

export async function findUsernameOwner(username: string) {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      email: true,
      emailVerified: true,
    },
  })
}

export async function createUser(payload: {
  email: string
  name: string
  username: string
  password: string
}) {
  const user = await prisma.user.create({
    data: {
      ...payload,
      emailVerified: false,
    },
  })

  return toPublicUser(user)
}

export async function updateUnverifiedUser(
  email: string,
  payload: {
    name: string
    username: string
    password: string
  }
) {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: payload,
  })

  return toPublicUser(user)
}

export async function verifyUserEmail(email: string) {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: true,
    },
  })

  return toPublicUser(user)
}

export async function updateUserPassword(email: string, password: string) {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  })

  return toPublicUser(user)
}

export async function createEmailVerification(payload: {
  email: string
  code: string
  type: EmailVerificationType
  expiresAt: Date
}) {
  await prisma.emailVerification.deleteMany({
    where: {
      email: payload.email,
      type: payload.type,
    },
  })

  return prisma.emailVerification.create({
    data: payload,
  })
}

export async function findEmailVerification(payload: {
  email: string
  code: string
  type?: EmailVerificationType
}) {
  return prisma.emailVerification.findFirst({
    where: payload,
  })
}

export async function deleteEmailVerification(id: string) {
  return prisma.emailVerification.delete({
    where: {
      id,
    },
  })
}
