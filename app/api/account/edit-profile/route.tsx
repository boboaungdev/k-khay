import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const { id, name, username } = await req.json()

    if (!id || !name || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const normalizedUsername = username.toLowerCase()

    // Check if another verified account already owns this username
    const existingUser = await prisma.user.findFirst({
      where: {
        username: normalizedUsername,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      )
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        username: normalizedUsername,
      },
    })

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      emailVerified: user.emailVerified,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json({
      message: "Profile updated",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
