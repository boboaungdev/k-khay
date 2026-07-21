"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signinAction } from "@/features/auth/actions/signin"
import { signinSchema } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { ChevronLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useMemo, useState } from "react"

type FormErrors = {
  email?: string[]
  password?: string[]
  root?: string[]
}

export default function SignInForm() {
  const router = useRouter()
  const { email } = useAuthStore()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const isSigninInvalid = useMemo(
    () => !signinSchema.safeParse({ email, password }).success,
    [email, password]
  )

  const handleSignin = async () => {
    if (!email) {
      router.push("/auth")
      return
    }

    const result = signinSchema.safeParse({ email, password })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const data = await signinAction({
        email,
        password,
      })

      if (!data.ok) {
        setErrors({
          root: [data.error],
        })
        return
      }

      useAuthStore.getState().setUser(data.user)
      router.replace("/account")
    } catch (error) {
      console.error(error)

      setErrors({
        root: ["Failed to connect to server"],
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
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 size-5 text-muted-foreground" />
          <Input id="email" value={email ?? ""} className="pl-10" disabled />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="pr-10 pl-10"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors({})
            }}
            onKeyDown={handleKeyDown(handleSignin, isSigninInvalid)}
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
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password[0]}</p>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleSignin}
        disabled={isSigninInvalid || isLoading}
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className="w-fit gap-1 self-start px-0 text-muted-foreground"
          onClick={() => {
            router.push("/auth")
          }}
        >
          <ChevronLeft className="size-4" />
          <span>Back</span>
        </Button>
        <Button
          variant="link"
          className="w-fit px-0 text-sm text-muted-foreground"
          onClick={() => router.push("/auth/forgot-password")}
          disabled={isLoading}
        >
          Forgot password?
        </Button>
      </div>
    </div>
  )
}
