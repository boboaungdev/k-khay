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

export function checkAccountUsername(username: string, email: string) {
  return request<{ available: boolean }>(
    `/api/account/check-username?username=${encodeURIComponent(
      username
    )}&email=${encodeURIComponent(email)}`
  )
}

export function updateProfile(payload: {
  id: string
  name: string
  username: string
}) {
  return request<{ message: string; user: unknown }>("/api/account/edit-profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

export function uploadAvatar(formData: FormData) {
  return request<{ message: string; user: unknown }>(
    "/api/account/upload-avatar",
    {
      method: "PATCH",
      body: formData,
    }
  )
}
