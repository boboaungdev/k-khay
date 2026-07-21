"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar?: string
  emailVerified: boolean
}

interface AuthState {
  user: User | null
  email: string | null
  hydrated: boolean

  setUser: (user: User) => void
  setEmail: (email: string | null) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      email: null,
      hydrated: false,

      setUser: (user) =>
        set({
          user,
        }),

      setEmail: (email) => set({ email }),

      updateUser: (user) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...user,
              }
            : null,
        })),

      logout: () =>
        set({
          user: null,
          email: null,
        }),

      setHydrated: () =>
        set({
          hydrated: true,
        }),
    }),
    {
      name: "auth",

      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
