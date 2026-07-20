import { NextResponse } from "next/server"
import {  prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { EmailVerificationType } from "@/lib/generated/prisma/enums"

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json()

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        type: EmailVerificationType.RESET_PASSWORD,
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

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    })

    await prisma.emailVerification.delete({
      where: {
        id: verification.id,
      },
    })

    return NextResponse.json({
      message: "Password reset successfully",
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
