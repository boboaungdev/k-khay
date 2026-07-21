"use client"

import { Button } from "@/components/ui/button"
import { forgotPasswordAction } from "@/features/auth/actions/forgot-password"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type FormErrors = {
  root?: string[]
}

export default function ForgotPasswordForm() {
  const router = useRouter()
  const { email } = useAuthStore()
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async () => {
    if (!email) {
      router.push("/auth")
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const data = await forgotPasswordAction(email)

      if (!data.ok) {
        setErrors({ root: [data.error || "Failed to send reset code"] })
        return
      }

      router.push("/auth/reset-password")
    } catch (error) {
      console.error("Forgot password error", error)
      setErrors({
        root: ["Failed to connect to the server."],
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      {errors.root && (
        <p className="mb-4 text-center text-sm text-red-500">
          {errors.root[0]}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        We will send a password reset link to <strong>{email}</strong>.
      </p>
      <Button
        className="w-full"
        onClick={handleForgotPassword}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
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
  )
}
