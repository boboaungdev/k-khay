export type AuthFlowKind = "signup" | "reset-password"

export type AuthStep =
  | "email"
  | "signin"
  | "signup"
  | "verify-email"
  | "reset-password"

export type FormErrors = Record<string, string[] | undefined>

export type ApiResult<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: string
    }
