"use client"

import Image from "next/image"
import AppName from "@/components/app-name"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { APP_INFO } from "@/constatnts"

type AuthCardProps = {
  title: string
  description: string
  children: React.ReactNode
}

export default function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
