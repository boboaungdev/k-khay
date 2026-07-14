import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerified: true,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json({
      exists: !!user,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
