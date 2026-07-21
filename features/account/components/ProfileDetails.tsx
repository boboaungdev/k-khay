"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AtSign, Loader2, Mail, Upload, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { uploadAvatarAction } from "@/features/account/actions/upload-avatar"
import EditProfileForm from "@/features/account/components/forms/EditProfileForm"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { cn } from "@/lib/utils"

export default function ProfileDetails() {
  const { user, setUser } = useAuthStore()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    )
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

      const data = await uploadAvatarAction(formData)
      if (!data.ok) {
        toast.error(data.error || "Upload failed")
        return
      }
      setUser(data.user)
      toast.success("Avatar updated.")
    } catch (err) {
      console.error(err)
      toast.error("Upload failed.")
    } finally {
      setIsUploadingAvatar(false)
      e.target.value = ""
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
          <EditProfileForm />
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
            disabled={isUploadingAvatar}
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
