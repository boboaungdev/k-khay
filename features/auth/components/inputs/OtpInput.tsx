"use client"

import { KeyRound } from "lucide-react"

import { Input } from "@/components/ui/input"

export function OtpInput(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative flex items-center">
      <KeyRound className="absolute left-3 size-5 text-muted-foreground" />
      <Input
        type="text"
        inputMode="numeric"
        maxLength={6}
        className="pl-10"
        {...props}
      />
    </div>
  )
}
