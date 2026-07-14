"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    if (hydrated && user) {
      router.replace("/account")
    }
  }, [hydrated, user, router])

  if (!hydrated) {
    return null
  }

  return children
}
