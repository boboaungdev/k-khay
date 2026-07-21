"use client"

import AuthCard from "@/features/auth/components/AuthCard"
import ForgotPasswordForm from "@/features/auth/components/forms/ForgotPasswordForm"
import { Suspense } from "react"

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <AuthCard
        title="Forgot Password"
        description="Enter your email to reset your password"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </Suspense>
  )
}
