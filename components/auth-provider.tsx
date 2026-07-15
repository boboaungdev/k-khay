"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    if (!hydrated) return

    if (user && pathname === "/auth") {
      router.replace("/account")
    }
  }, [hydrated, user, pathname, router])

  if (!hydrated) {
    return null
  }

  return children
}