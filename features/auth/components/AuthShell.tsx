import Image from "next/image"

import AppName from "@/components/app-name"
import { APP_INFO } from "@/constatnts"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src="/logo.png"
          alt={`${APP_INFO.appName} logo`}
          width={100}
          height={100}
          loading="eager"
        />
        <div className="flex flex-col">
          <AppName />
          <p className="text-sm text-muted-foreground">{APP_INFO.appTagLine}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
