import AuthFlow from "@/features/auth/components/AuthFlow"

export default function ResetPasswordPage() {
  return <AuthFlow initialStep="reset-password" initialFlow="reset-password" />
}
