"use client"

import { Eye, EyeOff, Lock } from "lucide-react"

import { Input } from "@/components/ui/input"

export function PasswordInput({
  visible,
  onToggleVisible,
  ...props
}: React.ComponentProps<typeof Input> & {
  visible: boolean
  onToggleVisible: () => void
}) {
  return (
    <div className="relative flex items-center">
      <Lock className="absolute left-3 size-5 text-muted-foreground" />
      <Input
        type={visible ? "text" : "password"}
        className="pr-10 pl-10"
        {...props}
      />
      {props.value ? (
        <button
          type="button"
          disabled={props.disabled}
          onClick={onToggleVisible}
          className="absolute right-3 disabled:pointer-events-none disabled:opacity-50"
        >
          {visible ? (
            <EyeOff className="size-5 text-muted-foreground" />
          ) : (
            <Eye className="size-5 text-muted-foreground" />
          )}
        </button>
      ) : null}
    </div>
  )
}
