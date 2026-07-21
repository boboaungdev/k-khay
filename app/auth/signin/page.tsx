"use client"

import AuthCard from "@/features/auth/components/AuthCard"
import SignInForm from "@/features/auth/components/forms/SignInForm"

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <SignInForm />
    </AuthCard>
  )
}
