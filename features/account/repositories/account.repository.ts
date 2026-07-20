import { prisma } from "@/lib/prisma"

export async function findAccountUsernameOwner(username: string) {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      email: true,
      emailVerified: true,
    },
  })
}

export async function updateAccountProfile(payload: {
  id: string
  name: string
  username: string
}) {
  const user = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      name: payload.name,
      username: payload.username,
    },
  })

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    emailVerified: user.emailVerified,
    avatar: user.avatar ?? undefined,
  }
}

export async function findAccountAvatar(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      avatar: true,
    },
  })
}

export async function updateAccountAvatar(id: string, avatar: string) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      avatar,
    },
  })

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    emailVerified: user.emailVerified,
    avatar: user.avatar ?? undefined,
  }
}
