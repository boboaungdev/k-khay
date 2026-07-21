"use client"

import AuthCard from "@/features/auth/components/AuthCard"
import VerifyEmailForm from "@/features/auth/components/forms/VerifyEmailForm"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { Suspense } from "react"

function VerifyEmailPageContent() {
  const { email } = useAuthStore()

  return (
    <AuthCard
      title="Verify your email"
      description={`We sent a code to ${email}`}
    >
      <VerifyEmailForm />
    </AuthCard>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailPageContent />
    </Suspense>
  )
}
