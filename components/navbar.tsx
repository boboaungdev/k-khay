import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "./theme-toggle"
import { APP_INFO } from "@/constatnts"
import AppName from "./app-name"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.appName} logo`}
              width={72}
              height={72}
            />
            <div className="flex flex-col">
              <AppName />
              <span className="hidden text-xs text-muted-foreground md:inline-block">
                {APP_INFO.appTagLine}
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* Add more links here */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
