
import AccountCard from "@/features/account/components/AccountCard"
import { Settings } from "lucide-react"

export default function PreferencesPage() {
  return (
    <AccountCard
      title="Preferences"
      description="Set your account preferences."
    >
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <p>Set your account preferences.</p>
      </div>
    </AccountCard>
  )
}
