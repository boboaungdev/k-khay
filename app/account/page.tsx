"use client"

import { toast } from "sonner"
import { useState, useEffect } from "react"
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
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { TbDevices } from "react-icons/tb"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const setUser = useAuthStore((state) => state.setUser)
  const [name, setName] = useState(user?.name ?? "")
  const [username, setUsername] = useState(user?.username ?? "")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!user || username === user.username) {
      setUsernameAvailable(null)
      return
    }

    // Basic validation, you might want to use a schema like in your auth page
    if (username.length < 6) {
      setUsernameAvailable(null)
      return
    }

    const checkUsername = async () => {
      setIsCheckingUsername(true)
      try {
        const res = await fetch(
          `/api/account/check-username?username=${encodeURIComponent(username)}&email=${encodeURIComponent(user.email)}`
        )
        const data = await res.json()
        setUsernameAvailable(data.available)
      } catch (error) {
        console.error("Failed to check username", error)
        setUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }

    const handler = setTimeout(checkUsername, 500)
    return () => clearTimeout(handler)
  }, [username, user])

  if (!user) {
    return <div>Loading user information...</div>
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/account/edit-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
          name,
          username,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile.")
        return
      }

      setUser(data.user)
      setIsOpen(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Save profile error:", error)
      toast.error("An error occurred while updating your profile.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.")
      return
    }

    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()

      formData.append("avatar", file)
      formData.append("id", user.id)

      const res = await fetch("/api/account/upload-avatar", {
        method: "PATCH",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Upload failed")
        return
      }

      setUser(data.user)
      console.log("Avatar updated successfully:", data.user)

      toast.success("Avatar updated.")
    } catch (err) {
      console.error(err)
      toast.error("Upload failed.")
    } finally {
      setIsUploadingAvatar(false)
      e.target.value = ""
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (open && user) {
      setName(user.name)
      setUsername(user.username)
      setUsernameAvailable(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </CardTitle>
          <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger
              render={
                <Button variant="ghost" className="flex items-center gap-2" />
              }
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Update your profile information.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 size-5 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      disabled={isSaving}
                      className="pl-10"
                    />
                  </div>
                  {name.length > 0 && name.length < 2 ? (
                    <p className="text-sm text-muted-foreground">
                      Name must be at least 2 characters.
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative flex items-center">
                    <AtSign className="absolute left-3 size-5 text-muted-foreground" />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toLowerCase())
                      }
                      disabled={isSaving}
                      placeholder="username"
                      className="pr-10 pl-10"
                    />
                    <div className="absolute right-3 flex items-center">
                      {isCheckingUsername && (
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                      )}
                      {!isCheckingUsername &&
                        username !== user.username &&
                        usernameAvailable === true && (
                          <CheckCircle2 className="size-5 text-green-500" />
                        )}
                      {!isCheckingUsername &&
                        username !== user.username &&
                        usernameAvailable === false && (
                          <XCircle className="size-5 text-red-500" />
                        )}
                    </div>
                  </div>
                  {username === user.username ? (
                    <p className="text-sm text-muted-foreground">
                      This is your current username.
                    </p>
                  ) : username.length > 0 && username.length < 6 ? (
                    <p className="text-sm text-muted-foreground">
                      Username must be at least 6 characters.
                    </p>
                  ) : !isCheckingUsername && usernameAvailable === true ? (
                    <p className="text-sm text-green-500">
                      Username is available.
                    </p>
                  ) : !isCheckingUsername && usernameAvailable === false ? (
                    <p className="text-sm text-red-500">
                      Username is already taken.
                    </p>
                  ) : null}
                </div>
              </div>
              <SheetFooter>
                <Button
                  type="submit"
                  disabled={
                    (name === user.name && username === user.username) ||
                    name.length < 2 ||
                    isCheckingUsername ||
                    (username !== user.username &&
                      usernameAvailable !== true) ||
                    isSaving
                  }
                  onClick={handleSave}
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-sm text-muted-foreground">
          Update your profile information.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-fit">
          <label
            htmlFor="avatar-upload"
            className={cn(
              "group relative cursor-pointer",
              isUploadingAvatar && "pointer-events-none opacity-70"
            )}
          >
            <Avatar className="h-20 w-20">
              <AvatarImage
                key={user.avatar}
                src={user.avatar ?? undefined}
                alt={user.name ?? "Avatar"}
              />

              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="absolute right-0 bottom-0 rounded-full bg-primary p-1.5">
              {isUploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              ) : (
                <Upload className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarUpload}
          />
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

  const handleCategoryChange = (categoryId: string | null) => {
    if (categoryId) {
      const params = new URLSearchParams(searchParams)
      params.set("category", categoryId)
      router.replace(`${pathname}?${params.toString()}`)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="flex w-full flex-1 gap-8">
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
                onClick={() => handleCategoryChange(category.id)}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.label}</span>
              </Button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="mb-4 md:hidden">
            <Select value={activeCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category">
                  {(() => {
                    const activeCategoryDetails = categories.find(
                      (c) => c.id === activeCategory
                    )
                    if (!activeCategoryDetails) {
                      return null
                    }
                    const Icon = activeCategoryDetails.icon
                    return (
                      <>
                        <Icon className="h-5 w-5" />
                        <span>{activeCategoryDetails.label}</span>
                      </>
                    )
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-3">
                      <category.icon className="h-5 w-5" />
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {ActiveComponent && <ActiveComponent />}
        </main>
      </div>
    </div>
  )
}
