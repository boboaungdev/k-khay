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

    // Get user with password for verification
    const user = await prisma.user.findUnique({
      where: {
        email,
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

    if (!user.password) {
      return NextResponse.json(
        { error: "This account uses OAuth login" },
        { status: 400 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Remove password before sending user data
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Signin successful",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
