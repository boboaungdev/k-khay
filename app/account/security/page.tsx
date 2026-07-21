
import AccountCard from "@/features/account/components/AccountCard"
import { Shield } from "lucide-react"

export default function SecurityPage() {
  return (
    <AccountCard
      title="Security"
      description="Update your security settings, like password and 2FA."
    >
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <p>Update your security settings, like password and 2FA.</p>
      </div>
    </AccountCard>
  )
}
