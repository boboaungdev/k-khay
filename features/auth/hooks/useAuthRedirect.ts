import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { AUTH_ROUTES } from "@/features/auth/constants/auth.routes"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function useAuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const { hydrated, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!hydrated) return

    if (isAuthenticated && pathname.startsWith(AUTH_ROUTES.root)) {
      router.replace(AUTH_ROUTES.account)
    }
  }, [hydrated, isAuthenticated, pathname, router])
}
