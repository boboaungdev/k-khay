import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const username = searchParams.get("username")?.toLowerCase()

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json({
      available: !user,
    })
  } catch (error) {
    console.error("Check username error:", error)

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
