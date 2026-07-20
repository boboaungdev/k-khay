"use client"

import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"

export function SocialLoginButtons({ disabled }: { disabled?: boolean }) {
  return (
    <>
      <Button
        variant="outline"
        className="flex w-full items-center gap-2"
        disabled={disabled}
      >
        <FcGoogle />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="flex w-full items-center gap-2"
        disabled={disabled}
      >
        <FaGithub />
        Continue with GitHub
      </Button>
    </>
  )
}
