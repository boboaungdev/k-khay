import AuthFlow from "@/features/auth/components/AuthFlow"

export default function ForgotPasswordPage() {
  return <AuthFlow initialStep="signin" initialFlow="reset-password" />
}
