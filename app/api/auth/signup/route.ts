import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, name, username, password } = await req.json()

    if (!email || !name || !username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Check email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      // User already completed registration
      if (existingEmail.emailVerified) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        )
      }

      // Username belongs to another verified account
      const usernameOwner = await prisma.user.findFirst({
        where: {
          username,
          NOT: {
            email,
          },
        },
      })

      if (usernameOwner) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        )
      }

      // Update unfinished account
      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          name,
          username,
          password: hashedPassword,
        },
      })

      return NextResponse.json({
        message: "User updated",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      })
    }

    // Brand new account
    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        emailVerified: false,
      },
    })

    return NextResponse.json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
