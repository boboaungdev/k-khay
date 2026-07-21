"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resendCodeAction } from "@/features/auth/actions/resend-code"
import { resetPasswordAction } from "@/features/auth/actions/reset-password"
import { resetPasswordSchema } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"
import {
  ChevronLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useEffect, useMemo, useState } from "react"

type FormErrors = {
  otp?: string[]
  password?: string[]
  rePassword?: string[]
  root?: string[]
}

export default function ResetPasswordForm() {
  const router = useRouter()
  const { email } = useAuthStore()

  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)

  const [countdown, setCountdown] = useState(60)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const isResetPasswordInvalid = useMemo(
    () => !resetPasswordSchema.safeParse({ otp, password, rePassword }).success,
    [otp, password, rePassword]
  )

  useEffect(() => {
    setIsCountingDown(true)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setIsCountingDown(false)
    }

    return () => clearInterval(interval)
  }, [isCountingDown, countdown])

  const handleResendCode = async () => {
    if (!email) {
      router.push("/auth")
      return
    }

    setIsResending(true)
    setErrors({})

    try {
      const result = await resendCodeAction({
        email,
        type: "reset-password",
      })

      if (!result.ok) {
        setErrors({
          root: [result.error || "Failed to resend code"],
        })
        return
      }

      setOtp("")
      setCountdown(60)
      setIsCountingDown(true)
    } catch (error) {
      console.error(error)
      setErrors({
        root: ["Failed to connect to server"],
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      router.push("/auth")
      return
    }

    if (otp.length !== 6) {
      setErrors({ otp: ["Verification code must be 6 digits."] })
      return
    }

    const result = resetPasswordSchema.safeParse({
      otp,
      password,
      rePassword,
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const data = await resetPasswordAction({
        email,
        code: otp,
        password,
        rePassword,
      })

      if (!data.ok) {
        setErrors({
          root: [data.error || "Password reset failed"],
        })
        return
      }

      useAuthStore.getState().setUser(data.user)
      router.replace("/account")
    } catch (error) {
      console.error("Password reset error:", error)
      setErrors({
        root: ["Failed to connect to the server."],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown =
    (handler: () => void, isInvalid: boolean) =>
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isInvalid) {
        handler()
      }
    }

  const formatCountdown = (seconds: number) =>
    `0:${seconds.toString().padStart(2, "0")}`

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <div className="relative flex items-center">
          <KeyRound className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="verification-code"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, ""))
              setErrors({})
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && otp.length === 6)
                document.getElementById("password")?.focus()
            }}
            disabled={isLoading}
            className="pl-10"
          />
          <div className="absolute right-3 flex items-center">
            <Button
              variant="link"
              className="h-auto w-fit self-end px-0 text-muted-foreground"
              onClick={handleResendCode}
              disabled={isCountingDown || isLoading || isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Resending...
                </>
              ) : isCountingDown ? (
                `Resend in ${formatCountdown(countdown)}`
              ) : (
                "Resend code"
              )}
            </Button>
          </div>
        </div>
        {errors.otp && (
          <p className="text-xs text-red-500">{errors.otp[0]}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="pr-10 pl-10"
            placeholder="new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors({})
            }}
            disabled={isLoading}
          />
          {password && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 disabled:pointer-events-none disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-5 text-muted-foreground" />
              ) : (
                <Eye className="size-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        {password &&
          resetPasswordSchema.shape.password.safeParse(password).error && (
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters.
            </p>
          )}
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password[0]}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="re-password">Confirm New Password</Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="re-password"
            type={showRePassword ? "text" : "password"}
            className="pr-10 pl-10"
            placeholder="confirm new password"
            value={rePassword}
            onChange={(e) => {
              setRePassword(e.target.value)
              setErrors({})
            }}
            onKeyDown={handleKeyDown(
              handleResetPassword,
              isResetPasswordInvalid
            )}
            disabled={isLoading}
          />
          {rePassword && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowRePassword((prev) => !prev)}
              className="absolute right-3 disabled:pointer-events-none disabled:opacity-50"
            >
              {showRePassword ? (
                <EyeOff className="size-5 text-muted-foreground" />
              ) : (
                <Eye className="size-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        {rePassword &&
          resetPasswordSchema
            .safeParse({ otp, password, rePassword })
            .error?.flatten().fieldErrors.rePassword && (
            <p className="text-xs text-muted-foreground">
              Passwords must match.
            </p>
          )}
        {errors.rePassword && (
          <p className="text-xs text-red-500">{errors.rePassword[0]}</p>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleResetPassword}
        disabled={isResetPasswordInvalid || isLoading}
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className="w-fit gap-1 self-start px-0 text-muted-foreground"
          onClick={() => {
            router.push("/auth/signin")
          }}
        >
          <ChevronLeft className="size-4" />
          <span>Back to Sign In</span>
        </Button>
      </div>
    </div>
  )
}
