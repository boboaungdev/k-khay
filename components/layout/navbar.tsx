"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { APP_INFO, OTHER_SERVICE } from "@/constatnts"
import AppName from "@/components/app-name"
import {
  CircleUser,
  Globe,
  HardDrive,
  LayoutGrid,
  Server,
  Wallet,
  LogOut,
} from "lucide-react"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const services = [
  { name: "Account", href: "/account", icon: CircleUser },
  {
    name: OTHER_SERVICE.wallet.name,
    href: OTHER_SERVICE.wallet.href,
    icon: Wallet,
  },
  { name: "Domain", href: "/domain", icon: Globe },
  { name: "Drive", href: "/drive", icon: HardDrive },
  { name: "Web Hosting", href: "/web-hosting", icon: Server },
]

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 md:min-h-18 md:gap-3 md:py-0 lg:px-8">
        <div className="flex flex-1 items-center justify-between overflow-hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt={`${APP_INFO.appName} logo`}
              width={60}
              height={60}
              loading="eager"
            />

            <div className="flex flex-col">
              <AppName />
              <span className="hidden text-xs text-muted-foreground md:inline-block">
                {APP_INFO.appTagLine}
              </span>
            </div>
          </Link>

          <nav className="flex w-auto shrink-0 items-center justify-end gap-4 text-sm font-medium">
            {!user && <ThemeToggle />}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <LayoutGrid className="h-5 w-5" />
                <span className="sr-only">Services</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 p-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Our Services</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <Link key={service.name} href={service.href}>
                        <DropdownMenuItem className="flex h-auto cursor-pointer flex-col items-start gap-2 p-3">
                          <service.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{service.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 shrink-0 rounded-full"
                    />
                  }
                >
                  <Avatar>
                    <AvatarImage
                      src={user.avatar ?? ""}
                      alt={user.name ?? ""}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar ?? ""}
                            alt={user.name ?? ""}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.username}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem render={<Link href="/account" />}>
                    Account
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex w-full items-center justify-between">
                      <Label htmlFor="theme-switch" className="cursor-pointer">
                        Dark Mode
                      </Label>
                      <Switch
                        id="theme-switch"
                        checked={theme === "dark"}
                        onCheckedChange={(checked) =>
                          setTheme(checked ? "dark" : "light")
                        }
                      />
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      router.push("/auth")
                    }}
                    className="cursor-pointer text-red-500 focus:bg-red-100 focus:text-red-600 dark:focus:bg-red-900/60 dark:focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button>Get Started</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
