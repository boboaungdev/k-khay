import {
  Home,
  Link,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react"
import { TbDevices } from "react-icons/tb"

import type { AccountCategoryId } from "@/features/account/types/account.types"

export type AccountCategory = {
  id: AccountCategoryId
  label: string
  icon: LucideIcon | React.ComponentType
}

export const ACCOUNT_CATEGORIES: AccountCategory[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "devices", label: "Devices", icon: TbDevices },
  { id: "connections", label: "Connections", icon: Link },
  { id: "preferences", label: "Preferences", icon: Settings },
]
