"use client"

import { useAuthRedirect } from "@/features/auth/hooks/useAuthRedirect"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { hydrated } = useAuth()

  useAuthRedirect()

  if (!hydrated) {
    return null
  }

  return children
}
