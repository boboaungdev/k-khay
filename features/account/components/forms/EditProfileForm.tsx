"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  AtSign,
  CheckCircle2,
  Loader2,
  Pencil,
  User,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { checkAccountUsernameAction } from "@/features/account/actions/check-username"
import { editProfileAction } from "@/features/account/actions/edit-profile"
import { profileSchema } from "@/features/account/schemas/profile.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"

type FormErrors = {
  name?: string[]
  username?: string[]
  root?: string[]
}

export default function EditProfileForm() {
  const { user, setUser } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState(user?.name ?? "")
  const [username, setUsername] = useState(user?.username ?? "")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )

  useEffect(() => {
    if (!user || username === user.username) {
      setUsernameAvailable(null)
      return
    }

    const result = profileSchema.shape.username.safeParse(username)
    if (!result.success) {
      setUsernameAvailable(null)
      return
    }

    const checkUsername = async () => {
      setIsCheckingUsername(true)
      try {
        const data = await checkAccountUsernameAction(username, user.email)
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && user) {
      setName(user.name)
      setUsername(user.username)
      setErrors({})
      setUsernameAvailable(null)
    }
  }

  const handleSave = async () => {
    if (!user) return

    const result = profileSchema.safeParse({ name, username })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    setErrors({})
    setIsSaving(true)

    try {
      const data = await editProfileAction({ id: user.id, name, username })
      if (!data.ok) {
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

  const isFormUnchanged = name === user?.name && username === user?.username
  const isUsernameInvalid =
    username !== user?.username && usernameAvailable !== true

  return (
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
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors({})
                }}
                placeholder="Name"
                disabled={isSaving}
                className="pl-10"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative flex items-center">
              <AtSign className="absolute left-3 size-5 text-muted-foreground" />
              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase())
                  setErrors({})
                }}
                disabled={isSaving}
                placeholder="username"
                className="pr-10 pl-10"
              />
              <div className="absolute right-3 flex items-center">
                {isCheckingUsername && (
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                )}
                {!isCheckingUsername &&
                  username !== user?.username &&
                  usernameAvailable === true && (
                    <CheckCircle2 className="size-5 text-green-500" />
                  )}
                {!isCheckingUsername &&
                  username !== user?.username &&
                  usernameAvailable === false && (
                    <XCircle className="size-5 text-red-500" />
                  )}
              </div>
            </div>
            {errors.username ? (
              <p className="text-sm text-red-500">{errors.username[0]}</p>
            ) : username === user?.username ? (
              <p className="text-sm text-muted-foreground">
                This is your current username.
              </p>
            ) : !isCheckingUsername && usernameAvailable === true ? (
              <p className="text-sm text-green-500">Username is available.</p>
            ) : !isCheckingUsername && usernameAvailable === false ? (
              <p className="text-sm text-red-500">Username is already taken.</p>
            ) : null}
          </div>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            disabled={
              isFormUnchanged || isCheckingUsername || isUsernameInvalid || isSaving
            }
            onClick={handleSave}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
