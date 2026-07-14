import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        password: true,
        emailVerified: true,
      },
    })

    // Don't reveal whether email exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email first." },
        { status: 403 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: "Signin successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
