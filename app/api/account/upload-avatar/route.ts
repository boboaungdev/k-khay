import { r2 } from "@/lib/r2"
import { R2 } from "@/constatnts"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData()

    const id = formData.get("id") as string
    const avatar = formData.get("avatar") as File | null

    if (!id || !avatar) {
      return NextResponse.json(
        {
          error: "Avatar is required",
        },
        {
          status: 400,
        }
      )
    }

    if (!avatar.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are allowed",
        },
        {
          status: 400,
        }
      )
    }

    if (avatar.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Avatar must be smaller than 5 MB",
        },
        {
          status: 400,
        }
      )
    }

    // Get current avatar before updating
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        avatar: true,
      },
    })

    const oldAvatar = existingUser?.avatar

    const extension = avatar.name.split(".").pop()?.toLowerCase() ?? "png"

    const key = `avatars/${id}/${id}-${Date.now()}.${extension}`

    const buffer = Buffer.from(await avatar.arrayBuffer())

    // Upload new avatar
    await r2.send(
      new PutObjectCommand({
        Bucket: R2.R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: avatar.type,
      })
    )

    const avatarUrl = `${R2.R2_PUBLIC_URL}/${key}`

    // Update database
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: avatarUrl,
      },
    })

    // Delete previous avatar (if any)
    if (oldAvatar) {
      try {
        const oldKey = oldAvatar.replace(`${R2.R2_PUBLIC_URL}/`, "")

        await r2.send(
          new DeleteObjectCommand({
            Bucket: R2.R2_BUCKET,
            Key: oldKey,
          })
        )
      } catch (error) {
        console.error("Failed to delete old avatar:", error)
      }
    }

    const { password, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Avatar updated successfully",
        user: userWithoutPassword,
      },
      {
        status: 200,
      }
    )
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
