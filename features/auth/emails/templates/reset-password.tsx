export function resetPasswordTemplate(code: string) {
  return `
    <h2>Password Reset</h2>
    <p>Your password reset code:</p>
    <h1>${code}</h1>
    <p>This code expires in 10 minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
  `
}
