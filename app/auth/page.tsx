"use client"

import Image from "next/image"
import AppName from "@/components/app-name"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { APP_INFO } from "@/constatnts"
import { useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import {
  AtSign,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo, KeyboardEvent } from "react"
import { z } from "zod"
import { emailSchema, otpSchema, signinSchema, signupSchema } from "./schema"

function Auth() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const data = searchParams.get("data")
  const state = data ? JSON.parse(decodeURIComponent(data)) : {}

  const [step, setStep] = useState(state.step ?? "email")
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [email, setEmail] = useState(state.email ?? "")
  const [name, setName] = useState(state.name ?? "")
  const [username, setUsername] = useState(state.username ?? "")
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(59)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [errors, setErrors] = useState<z.ZodError["formErrors"]["fieldErrors"]>(
    {}
  )

  const isEmailInvalid = useMemo(
    () => !emailSchema.safeParse({ email }).success,
    [email]
  )
  const isSignupInvalid = useMemo(
    () =>
      !signupSchema.safeParse({ name, username, password, rePassword }).success,
    [name, username, password, rePassword]
  )
  const isOtpInvalid = useMemo(
    () => !otpSchema.safeParse({ otp }).success,
    [otp]
  )
  const isSigninInvalid = useMemo(
    () => !signinSchema.safeParse({ email, password }).success,
    [email, password]
  )

  useEffect(() => {
    const data = searchParams.get("data")
    const state = data ? JSON.parse(decodeURIComponent(data)) : {}
    setStep(state.step ?? "email")
  }, [searchParams])

  useEffect(() => {
    if (step === "verify-email") {
      setIsCountingDown(true)
    }
  }, [step])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setIsCountingDown(false)
      setCountdown(59)
    }

    return () => clearInterval(interval)
  }, [isCountingDown, countdown])

  const handleResendCode = () => {
    // TODO: Implement actual code resend logic here
    setIsCountingDown(true)
  }

  const handleContinueFromEmail = () => {
    const result = emailSchema.safeParse({ email })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }
    setErrors({})
    const data = encodeURIComponent(
      JSON.stringify({
        email,
        step: "signin",
      })
    )
    router.push(`${pathname}?data=${data}`)
  }

  const handleNextFromSignup = () => {
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
    const data = encodeURIComponent(
      JSON.stringify({ email, name, username, step: "verify-email" })
    )
    router.push(`${pathname}?data=${data}`)
  }

  const handleVerifyOtp = () => {
    const result = otpSchema.safeParse({ otp })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }
    setErrors({})
    // TODO: Implement actual OTP verification logic here
    console.log("OTP verified:", otp)
  }

  const handleSignin = () => {
    const result = signinSchema.safeParse({ email, password })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }
    setErrors({})
    // TODO: Implement actual signin logic here
    console.log("Signing in with:", result.data)
  }

  const handleKeyDown =
    (handler: () => void, isInvalid: boolean) =>
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isInvalid) {
        handler()
      }
    }
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src="/logo.png"
          alt={`${APP_INFO.appName} logo`}
          width={100}
          height={100}
          loading="eager"
        />
        <div className="flex flex-col">
          <AppName />
          <p className="text-sm text-muted-foreground">{APP_INFO.appTagLine}</p>
        </div>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>
            {step === "email" && "Welcome"}
            {step === "signup" && "Sign Up"}
            {step === "signin" && "Welcome Back"}
            {step === "verify-email" && "Verify your email"}
          </CardTitle>
          <CardDescription>
            {step === "email" && "Contine with OAuth or Email"}
            {step === "signup" && "Create your account to continue"}
            {step === "signin" && "Sign in to your account to continue"}
            {step === "verify-email" && `We sent a code to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="flex w-full items-center gap-2"
              >
                <FcGoogle />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="flex w-full items-center gap-2"
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
                    placeholder="m@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    onKeyDown={handleKeyDown(
                      handleContinueFromEmail,
                      isEmailInvalid
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email[0]}</p>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleContinueFromEmail}
                disabled={isEmailInvalid}
              >
                Continue
              </Button>
            </div>
          ) : step === "signup" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 size-5 text-muted-foreground" />
                  <Input id="email" value={email} className="pl-10" disabled />
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
                    onChange={(e) => setName(e.target.value)}
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
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    id="username"
                    placeholder="johndoe"
                    className="pl-10"
                  />
                </div>
                {username &&
                  signupSchema.shape.username.safeParse(username).error && (
                    <p className="text-xs text-muted-foreground">
                      Username must be at least 6 characters and can only
                      contain letters and numbers.
                    </p>
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <div
                      className="absolute right-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
                {password &&
                  signupSchema.shape.password.safeParse(password).error && (
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
                    onChange={(e) => setRePassword(e.target.value)}
                    onKeyDown={handleKeyDown(
                      handleNextFromSignup,
                      isSignupInvalid
                    )}
                  />
                  {rePassword && (
                    <div
                      className="absolute right-3 cursor-pointer"
                      onClick={() => setShowRePassword(!showRePassword)}
                    >
                      {showRePassword ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </div>
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
                disabled={isSignupInvalid}
              >
                Next
              </Button>
              <Button
                variant="link"
                className="w-fit gap-1 self-start px-0 text-muted-foreground"
                onClick={() =>
                  router.push(
                    `${pathname}?data=${encodeURIComponent(
                      JSON.stringify({
                        email,
                        name,
                        username,
                        step: "email",
                      })
                    )}`
                  )
                }
              >
                <ChevronLeft className="size-4" />
                <span>Back</span>
              </Button>
            </div>
          ) : step === "signin" ? (
            // TODO: Implement signin logic
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 size-5 text-muted-foreground" />
                  <Input id="email" value={email} className="pl-10" disabled />
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
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown(handleSignin, isSigninInvalid)}
                  />
                  {password && (
                    <div
                      className="absolute right-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password[0]}</p>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleSignin}
                disabled={isSigninInvalid}
              >
                Continue
              </Button>
              <Button
                variant="link"
                className="w-fit gap-1 self-start px-0 text-muted-foreground"
                onClick={() =>
                  router.push(
                    `${pathname}?data=${encodeURIComponent(
                      JSON.stringify({
                        step: "email",
                      })
                    )}`
                  )
                }
              >
                <ChevronLeft className="size-4" />
                <span>Back</span>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <InputOTP
                  containerClassName="justify-center"
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onComplete={handleVerifyOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {errors.otp && (
                <p className="text-center text-xs text-red-500">
                  {errors.otp[0]}
                </p>
              )}
              <Button
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={isOtpInvalid}
              >
                Verify
              </Button>
              <div className="flex items-center justify-between">
                <Button
                  variant="link"
                  className="w-fit gap-1 self-start px-0 text-muted-foreground"
                  onClick={() =>
                    router.push(
                      `${pathname}?data=${encodeURIComponent(
                        JSON.stringify({
                          email,
                          name,
                          username,
                          step: "signup",
                        })
                      )}`
                    )
                  }
                >
                  <ChevronLeft className="size-4" />
                  <span>Back</span>
                </Button>
                <Button
                  variant="link"
                  className="w-fit self-end px-0 text-muted-foreground"
                  onClick={handleResendCode}
                  disabled={isCountingDown}
                >
                  {isCountingDown
                    ? `Resend code in ${countdown}s`
                    : "Resend code"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  )
}
