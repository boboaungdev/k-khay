import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const username = searchParams.get("username")?.toLowerCase()
    const email = searchParams.get("email")?.toLowerCase()

    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        email: true,
        emailVerified: true,
      },
    })

    if (!user) {
      return NextResponse.json({
        available: true,
      })
    }

    // Allow reuse if it is the same unverified account
    if (user.email === email && !user.emailVerified) {
      return NextResponse.json({
        available: true,
      })
    }

    return NextResponse.json({
      available: false,
    })
  } catch (error) {
    console.error("Check username error:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}