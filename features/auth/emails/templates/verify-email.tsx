export function verifyEmailTemplate(code: string) {
  return `
    <h2>Email Verification</h2>
    <p>Your verification code:</p>
    <h1>${code}</h1>
    <p>This code expires in 10 minutes.</p>
  `
}
