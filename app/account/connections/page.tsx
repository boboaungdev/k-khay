
import AccountCard from "@/features/account/components/AccountCard"
import { Link } from "lucide-react"

export default function ConnectionsPage() {
  return (
    <AccountCard
      title="Connections"
      description="Manage third-party application connections."
    >
      <div className="flex items-center gap-2">
        <Link className="h-5 w-5" />
        <p>Manage third-party application connections.</p>
      </div>
    </AccountCard>
  )
}
