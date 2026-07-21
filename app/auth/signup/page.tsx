"use client"

import AuthCard from "@/features/auth/components/AuthCard"
import { SignUpForm } from "@/features/auth/components/forms/SignUpForm"

export default function SignUpPage() {
  return (
    <AuthCard
      title="Sign Up"
      description="Create your account to continue"
    >
      <SignUpForm />
    </AuthCard>
  )
}
