import { generateToken } from "@/features/auth/utils/generate-token"

export function generateSessionToken() {
  return generateToken()
}
