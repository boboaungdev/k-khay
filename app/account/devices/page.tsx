
import AccountCard from "@/features/account/components/AccountCard"
import { TbDevices } from "react-icons/tb"

export default function DevicesPage() {
  return (
    <AccountCard
      title="Devices"
      description="See and manage devices that have access to your account."
    >
      <div className="flex items-center gap-2">
        <TbDevices className="h-5 w-5" />
        <p>See and manage devices that have access to your account.</p>
      </div>
    </AccountCard>
  )
}
