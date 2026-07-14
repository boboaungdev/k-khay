import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transporter } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
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

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code:</p>
        <h1>${code}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
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
