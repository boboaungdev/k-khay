"use client"

import AuthCard from "@/features/auth/components/AuthCard"
import ResetPasswordForm from "@/features/auth/components/forms/ResetPasswordForm"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <AuthCard
        title="Reset your password"
        description="Enter your new password"
      >
        <ResetPasswordForm />
      </AuthCard>
    </Suspense>
  )
}
