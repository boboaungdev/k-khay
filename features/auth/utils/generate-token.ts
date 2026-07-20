import { randomBytes } from "crypto"

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex")
}
