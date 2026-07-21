"use client"

import AuthCard from "@/features/auth/components/AuthCard"
import EmailForm from "@/features/auth/components/forms/EmailForm"

export default function AuthPage() {
  return (
    <AuthCard title="Welcome" description="Contine with OAuth or Email">
      <EmailForm />
    </AuthCard>
  )
}
