"use client"

import { Mail } from "lucide-react"

import { Input } from "@/components/ui/input"

export function EmailInput(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative flex items-center">
      <Mail className="absolute left-3 size-5 text-muted-foreground" />
      <Input type="email" className="pl-10" {...props} />
    </div>
  )
}
