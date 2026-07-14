import Link from "next/link"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <div className="flex flex-col">
              <span className="font-bold sm:inline-block">k-khay</span>
              <span className="hidden text-xs text-muted-foreground md:inline-block">
                Your App Tagline
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
