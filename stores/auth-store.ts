"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  username: string
  emailVerified: boolean
}

interface AuthState {
  user: User | null

  setUser: (user: User) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({
          user,
        }),

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
        }),
    }),
    {
      name: "auth",

      storage: createJSONStorage(() => localStorage),
    }
  )
)
