"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  User,
  Shield,
  Link,
  Mail,
  AtSign,
  Settings,
  Pencil,
  Home,
  type LucideIcon,
} from "lucide-react"
import { TbDevices } from "react-icons/tb"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

type Category = {
  id: string
  label: string
  icon: LucideIcon | React.ComponentType
}

const categories: Category[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "userinfo", label: "User Info", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "devices", label: "Devices", icon: TbDevices },
  { id: "connections", label: "Connections", icon: Link },
  { id: "preferences", label: "Preferences", icon: Settings },
]

function ProfileDetails() {
  return <div>Manage your profile settings here.</div>
}

function UserInfoDetails() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <div>Loading user information...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </CardTitle>
          <Button variant="ghost" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="name"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <User className="h-4 w-4" />
            <span>Name</span>
          </Label>
          <p id="name" className="font-semibold">
            {user.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="username"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <AtSign className="h-4 w-4" />
            <span>Username</span>
          </Label>
          <p id="username" className="text-muted-foreground">
            @{user.username}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Label>
          <p id="email" className="text-muted-foreground">
            {user.email}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function SecurityDetails() {
  return <div>Update your security settings, like password and 2FA.</div>
}

function DevicesDetails() {
  return <div>See and manage devices that have access to your account.</div>
}

function ConnectionsDetails() {
  return <div>Manage third-party application connections.</div>
}

function PreferencesDetails() {
  return <div>Set your account preferences.</div>
}

const detailComponents: { [key: string]: React.ComponentType } = {
  home: ProfileDetails,
  userinfo: UserInfoDetails,
  security: SecurityDetails,
  devices: DevicesDetails,
  connections: ConnectionsDetails,
  preferences: PreferencesDetails,
}

export default function AccountPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get("category")

  const activeCategory =
    urlCategory && categories.some((c) => c.id === urlCategory)
      ? urlCategory
      : "home"

  const ActiveComponent = detailComponents[activeCategory]
  const activeCategoryLabel =
    categories.find((c) => c.id === activeCategory)?.label || "Home"

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 p-4 sm:px-6 lg:px-8">
      <aside className="hidden w-1/4 md:block">
        <nav className="flex flex-col gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn(
                "justify-start gap-3 px-3",
                activeCategory === category.id &&
                  "bg-accent text-accent-foreground"
              )}
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set("category", category.id)
                router.replace(`${pathname}?${params.toString()}`)
              }}
            >
              <category.icon className="h-5 w-5" />
              <span>{category.label}</span>
            </Button>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{ActiveComponent && <ActiveComponent />}</main>
    </div>
  )
}
