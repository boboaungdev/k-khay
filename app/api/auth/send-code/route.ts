import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transporter } from "@/lib/mail"
import { APP_INFO, SMTP } from "@/constatnts"

export async function POST(req: Request) {
  try {
    const { email, type } = (await req.json()) as {
      email: string
      type: "signup" | "password-reset"
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }
    if (!type) {
      return NextResponse.json({ error: "Type required" }, { status: 400 })
    }

    if (type === "password-reset") {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return NextResponse.json(
          { error: "User with this email does not exist." },
          { status: 404 }
        )
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.emailVerification.deleteMany({
      where: {
        email,
      },
    })

    await prisma.emailVerification.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    })

    const subject =
      type === "password-reset"
        ? `[${APP_INFO.appName}] Reset your password`
        : `[${APP_INFO.appName}] Verify your email`

    const html =
      type === "password-reset"
        ? `
        <h2>Password Reset</h2>
        <p>Your password reset code:</p>
        <h1>${code}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `
        : `
        <h2>Email Verification</h2>
        <p>Your verification code:</p>
        <h1>${code}</h1>
        <p>This code expires in 10 minutes.</p>
      `

    await transporter.sendMail({
      from: SMTP.SMTP_EMAIL_FROM,
      to: email,
      subject,
      html,
    })

    return NextResponse.json({
      message: "Code sent",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to send email",
      },
      {
        status: 500,
      }
    )
  }
}
