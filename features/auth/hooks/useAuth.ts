import { useAuthStore } from "@/features/auth/store/auth.store"

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const setUser = useAuthStore((state) => state.setUser)
  const updateUser = useAuthStore((state) => state.updateUser)
  const logout = useAuthStore((state) => state.logout)

  return {
    user,
    hydrated,
    isAuthenticated: Boolean(user),
    setUser,
    updateUser,
    logout,
  }
}
