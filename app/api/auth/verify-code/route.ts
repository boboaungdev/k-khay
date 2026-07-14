import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
      },
    })

    if (!verification) {
      return NextResponse.json(
        {
          error: "Invalid code",
        },
        {
          status: 400,
        }
      )
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Code expired",
        },
        {
          status: 400,
        }
      )
    }

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
      omit: {
        password: true,
      },
    })

    await prisma.emailVerification.delete({
      where: {
        id: verification.id,
      },
    })

    return NextResponse.json({
      message: "Email verified",
      user,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    )
  }
}
