import type { ApiResult } from "@/features/auth/types/auth.types"

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, init)
    const data = await response.json()

    if (!response.ok) {
      return {
        ok: false,
        error: data.error ?? "Request failed",
      }
    }

    return {
      ok: true,
      data,
    }
  } catch {
    return {
      ok: false,
      error: "Failed to connect to server",
    }
  }
}

export function checkEmail(email: string) {
  return request<{ exists: boolean }>(
    `/api/auth/check-email?email=${encodeURIComponent(email)}`
  )
}

export function checkUsername(username: string, email: string) {
  return request<{ available: boolean }>(
    `/api/auth/check-username?username=${encodeURIComponent(
      username
    )}&email=${encodeURIComponent(email)}`
  )
}

export function signin(email: string, password: string) {
  return request<{ message: string; user: unknown }>("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
}

export function signup(payload: {
  email: string
  name: string
  username: string
  password: string
}) {
  return request<{ message: string; user: unknown }>("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

export function sendCode(
  email: string,
  type: "signup" | "reset-password"
) {
  return request<{ message: string }>("/api/auth/send-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      type,
    }),
  })
}

export function verifyEmail(email: string, code: string) {
  return request<{ message: string; user: unknown }>("/api/auth/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      type: "signup",
    }),
  })
}

export function resetPassword(
  email: string,
  code: string,
  password: string
) {
  return request<{ message: string; user: unknown }>("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      password,
    }),
  })
}
