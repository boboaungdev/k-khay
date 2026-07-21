"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resendCodeAction } from "@/features/auth/actions/resend-code"
import { verifyEmailAction } from "@/features/auth/actions/verify-email"
import { otpSchema } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { ChevronLeft, KeyRound, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react"

type FormErrors = {
  otp?: string[]
  root?: string[]
}

export default function VerifyEmailForm() {
  const router = useRouter()
  const { email } = useAuthStore()
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const isOtpInvalid = useMemo(
    () => !otpSchema.safeParse({ otp }).success,
    [otp]
  )

  const handleVerifyOtp = useCallback(async () => {
    if (isLoading || isResending || !email) return

    const result = otpSchema.safeParse({ otp })

    if (!result.success) {
      if (otp.length === 6) {
        setErrors(result.error.flatten().fieldErrors)
      }
      return
    }
    setErrors({})

    setIsLoading(true)
    try {
      const data = await verifyEmailAction({
        email,
        code: otp,
      })

      if (!data.ok) {
        setErrors({
          root: [data.error || "Verification failed"],
        })
        return
      }

      useAuthStore.getState().setUser(data.user)
      router.replace("/account")
    } catch (error) {
      console.error("OTP verification error:", error)
      setErrors({
        root: ["Failed to connect to server"],
      })
    } finally {
      setIsLoading(false)
    }
  }, [email, isLoading, isResending, otp, router])

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp()
    }
  }, [otp, handleVerifyOtp])

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
        type: "signup",
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
      {errors.root && (
        <p className="mb-4 text-center text-sm text-red-500">
          {errors.root[0]}
        </p>
      )}
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
            onKeyDown={handleKeyDown(
              handleVerifyOtp,
              isOtpInvalid || otp.length !== 6
            )}
            disabled={isLoading || isResending}
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
      </div>
      {errors.otp && (
        <p className="text-center text-xs text-red-500">{errors.otp[0]}</p>
      )}
      <Button
        className="w-full"
        onClick={handleVerifyOtp}
        disabled={isOtpInvalid || isLoading || isResending}
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className="w-fit gap-1 self-start px-0 text-muted-foreground"
          onClick={() => {
            router.push("/auth/signup")
          }}
        >
          <ChevronLeft className="size-4" />
          <span>Back</span>
        </Button>
      </div>
    </div>
  )
}
