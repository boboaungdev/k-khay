import { APP_INFO } from "@/constatnts"
import { EmailVerificationType } from "@/lib/generated/prisma/enums"
import { hashPassword, verifyPassword } from "@/lib/password"

import { resetPasswordTemplate } from "@/features/auth/emails/templates/reset-password"
import { verifyEmailTemplate } from "@/features/auth/emails/templates/verify-email"
import { sendAuthEmail } from "@/features/auth/emails/send-email"
import {
  createEmailVerification,
  createUser,
  deleteEmailVerification,
  findEmailVerification,
  findUserByEmail,
  findUsernameOwner,
  findVerifiedUserByEmail,
  updateUnverifiedUser,
  updateUserPassword,
  verifyUserEmail,
} from "@/features/auth/repositories/user.repository"
import { generateOtp } from "@/features/auth/utils/generate-otp"
import { normalizeEmail } from "@/features/auth/utils/normalize-email"

export async function checkEmailExists(email: string) {
  const user = await findVerifiedUserByEmail(normalizeEmail(email))

  return {
    exists: Boolean(user),
  }
}

export async function checkUsernameAvailable(username: string, email: string) {
  const normalizedUsername = username.toLowerCase()
  const normalizedEmail = normalizeEmail(email)
  const user = await findUsernameOwner(normalizedUsername)

  if (!user) {
    return {
      available: true,
    }
  }

  return {
    available: user.email === normalizedEmail && !user.emailVerified,
  }
}

export async function signInWithPassword(email: string, password: string) {
  const user = await findUserByEmail(normalizeEmail(email))

  if (!user || !user.emailVerified) {
    return {
      ok: false,
      error: !user ? "Invalid email or password" : "Please verify your email first.",
    } as const
  }

  if (!user.password) {
    return {
      ok: false,
      error: "This account uses OAuth login",
    } as const
  }

  const passwordMatch = await verifyPassword(password, user.password)

  if (!passwordMatch) {
    return {
      ok: false,
      error: "Invalid email or password",
    } as const
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      emailVerified: user.emailVerified,
      avatar: user.avatar ?? undefined,
    },
  } as const
}

export async function signUpWithPassword(payload: {
  email: string
  name: string
  username: string
  password: string
}) {
  const email = normalizeEmail(payload.email)
  const username = payload.username.toLowerCase()
  const password = await hashPassword(payload.password)
  const existingEmail = await findUserByEmail(email)

  if (existingEmail) {
    if (existingEmail.emailVerified) {
      return {
        ok: false,
        error: "Email already exists",
      } as const
    }

    const usernameOwner = await findUsernameOwner(username)

    if (usernameOwner && usernameOwner.email !== email) {
      return {
        ok: false,
        error: "Username already exists",
      } as const
    }

    const user = await updateUnverifiedUser(email, {
      name: payload.name,
      username,
      password,
    })

    return {
      ok: true,
      user,
    } as const
  }

  const existingUsername = await findUsernameOwner(username)

  if (existingUsername) {
    return {
      ok: false,
      error: "Username already exists",
    } as const
  }

  const user = await createUser({
    email,
    name: payload.name,
    username,
    password,
  })

  return {
    ok: true,
    user,
  } as const
}

export async function sendVerificationCode(
  email: string,
  type: "signup" | "reset-password"
) {
  const normalizedEmail = normalizeEmail(email)

  if (type === "reset-password") {
    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      return {
        ok: false,
        error: "User with this email does not exist.",
      } as const
    }
  }

  const verificationType =
    type === "signup"
      ? EmailVerificationType.SIGNUP
      : EmailVerificationType.RESET_PASSWORD
  const code = generateOtp()

  await createEmailVerification({
    email: normalizedEmail,
    code,
    type: verificationType,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  })

  await sendAuthEmail({
    to: normalizedEmail,
    subject:
      type === "reset-password"
        ? `[${APP_INFO.appName}] Reset your password`
        : `[${APP_INFO.appName}] Verify your email`,
    html:
      type === "reset-password"
        ? resetPasswordTemplate(code)
        : verifyEmailTemplate(code),
  })

  return {
    ok: true,
  } as const
}

export async function verifyEmailCode(email: string, code: string) {
  const verification = await findEmailVerification({
    email: normalizeEmail(email),
    code,
    type: EmailVerificationType.SIGNUP,
  })

  if (!verification) {
    return {
      ok: false,
      error: "Invalid code",
    } as const
  }

  if (verification.expiresAt < new Date()) {
    return {
      ok: false,
      error: "Code expired",
    } as const
  }

  const user = await verifyUserEmail(verification.email)

  await deleteEmailVerification(verification.id)

  return {
    ok: true,
    user,
  } as const
}

export async function resetUserPassword(payload: {
  email: string
  code: string
  password: string
}) {
  const verification = await findEmailVerification({
    email: normalizeEmail(payload.email),
    code: payload.code,
    type: EmailVerificationType.RESET_PASSWORD,
  })

  if (!verification) {
    return {
      ok: false,
      error: "Invalid code",
    } as const
  }

  if (verification.expiresAt < new Date()) {
    return {
      ok: false,
      error: "Code expired",
    } as const
  }

  const user = await updateUserPassword(
    verification.email,
    await hashPassword(payload.password)
  )

  await deleteEmailVerification(verification.id)

  return {
    ok: true,
    user,
  } as const
}
