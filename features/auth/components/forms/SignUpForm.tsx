"use client"

import { checkUsernameAction } from "@/features/auth/actions/check-username"
import { resendCodeAction } from "@/features/auth/actions/resend-code"
import { signupAction } from "@/features/auth/actions/signup"
import { signupSchema } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"
import {
  AtSign,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormErrors = {
  name?: string[]
  username?: string[]
  password?: string[]
  rePassword?: string[]
  root?: string[]
}

export function SignUpForm() {
  const router = useRouter()
  const { email } = useAuthStore()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const isSignupInvalid = useMemo(
    () =>
      !signupSchema.safeParse({ name, username, password, rePassword }).success,
    [name, username, password, rePassword]
  )

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!email) return
    setIsCheckingUsername(true)
    setUsernameAvailable(null)
    try {
      const data = await checkUsernameAction(usernameToCheck, email)
      setUsernameAvailable(data.available)
    } catch (error) {
      console.error("Failed to check username", error)
      setUsernameAvailable(null) // Error state
    } finally {
      setIsCheckingUsername(false)
    }
  }

  useEffect(() => {
    const isUsernameValid =
      signupSchema.shape.username.safeParse(username).success

    if (!isUsernameValid) {
      setUsernameAvailable(null)
      return
    }

    // Debounce the check
    const handler = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username)
      }
    }, 500)

    return () => clearTimeout(handler)
  }, [username, email])

  const handleNextFromSignup = async () => {
    if (!email) {
      router.push("/auth")
      return
    }

    const result = signupSchema.safeParse({
      name,
      username,
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
      const signupResult = await signupAction({
        email,
        name,
        username,
        password,
        rePassword,
      })

      if (!signupResult.ok) {
        setIsLoading(false)
        setErrors({ root: [signupResult.error || "Signup failed"] })
        return
      }

      const codeResult = await resendCodeAction({
        email,
        type: "signup",
      })

      if (!codeResult.ok) {
        throw new Error("Failed sending code")
      }

      router.push("/auth/verify-email")
    } catch (error) {
      console.error("Signup error", error)
      setErrors({ root: ["Failed to connect to the server."] })
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
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 size-5 text-muted-foreground" />
          <Input id="email" value={email ?? ""} className="pl-10" disabled />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative flex items-center">
          <User className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="name"
            placeholder="John Doe"
            className="pl-10"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors({})
            }}
            disabled={isLoading}
          />
        </div>
        {name && signupSchema.shape.name.safeParse(name).error && (
          <p className="text-xs text-muted-foreground">
            Name must be at least 2 characters.
          </p>
        )}
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name[0]}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative flex items-center">
          <AtSign className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            value={username}
            onChange={(e) => {
              setUsername(
                e.target.value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
              )
              setErrors({})
            }}
            id="username"
            placeholder="johndoe"
            className="pr-10 pl-10"
            disabled={isLoading}
          />
          <div className="absolute right-3 flex items-center">
            {isCheckingUsername && (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            )}
            {!isCheckingUsername && usernameAvailable === true && (
              <CheckCircle2 className="size-5 text-green-500" />
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <XCircle className="size-5 text-red-500" />
            )}
          </div>
        </div>
        {username && signupSchema.shape.username.safeParse(username).error && (
          <p className="text-xs text-muted-foreground">
            Username must be at least 6 characters and can only contain letters
            and numbers.
          </p>
        )}
        {!isCheckingUsername && usernameAvailable === true && (
          <p className="text-xs text-green-500">Username is available</p>
        )}
        {!isCheckingUsername && usernameAvailable === false && (
          <p className="text-xs text-red-500">Username is already taken</p>
        )}
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username[0]}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="pr-10 pl-10"
            placeholder="password"
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
        {password && signupSchema.shape.password.safeParse(password).error && (
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters.
          </p>
        )}
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password[0]}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="re-password">Confirm Password</Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 size-5 text-muted-foreground" />
          <Input
            id="re-password"
            type={showRePassword ? "text" : "password"}
            className="pr-10 pl-10"
            placeholder="confirm password"
            value={rePassword}
            onChange={(e) => {
              setRePassword(e.target.value)
              setErrors({})
            }}
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
          signupSchema
            .safeParse({ name, username, password, rePassword })
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
        onClick={handleNextFromSignup}
        disabled={
          isSignupInvalid ||
          isLoading ||
          isCheckingUsername ||
          usernameAvailable !== true
        }
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Creating account..." : "Next"}
      </Button>
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
    </div>
  )
}
