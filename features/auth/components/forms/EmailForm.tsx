"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { checkEmailAction } from "@/features/auth/actions/check-email"
import { emailSchema } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { Loader2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useMemo, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

type FormErrors = {
  email?: string[] | undefined
  root?: string[] | undefined
}

export default function EmailForm() {
  const router = useRouter()
  const { email, setEmail } = useAuthStore()
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const isEmailInvalid = useMemo(
    () => !emailSchema.safeParse({ email }).success,
    [email]
  )

  const handleContinueFromEmail = async () => {
    const normalizedEmail = (email ?? "").trim().toLowerCase()

    const result = emailSchema.safeParse({
      email: normalizedEmail,
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const data = await checkEmailAction(normalizedEmail)
      setEmail(normalizedEmail)
      const nextStep = data.exists ? "/auth/signin" : "/auth/signup"
      router.push(nextStep)
    } catch (error) {
      console.error("Failed to check email", error)

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

  return (
    <div className="grid gap-4">
      {errors.root && (
        <p className="mb-4 text-center text-sm text-red-500">
          {errors.root[0]}
        </p>
      )}
      <Button
        variant="outline"
        className="flex w-full items-center gap-2"
        disabled={isLoading}
      >
        <FcGoogle />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="flex w-full items-center gap-2"
        disabled={isLoading}
      >
        <FaGithub />
        Continue with GitHub
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="rounded-sm bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@example.com"
            className="pl-10"
            value={email ?? ""}
            onChange={(e) => {
              setEmail(e.target.value.replace(/\s/g, "").toLowerCase())
              setErrors({})
            }}
            onKeyDown={handleKeyDown(handleContinueFromEmail, isEmailInvalid)}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email[0]}</p>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleContinueFromEmail}
        disabled={isEmailInvalid || isLoading}
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Please wait" : "Continue"}
      </Button>
    </div>
  )
}
