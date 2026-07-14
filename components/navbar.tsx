import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { APP_INFO } from "@/constatnts"
import AppName from "./app-name"
import {
  CircleUser,
  Globe,
  HardDrive,
  LayoutGrid,
  Server,
  Wallet,
} from "lucide-react"

const services = [
  { name: "Account", href: "/services/account", icon: CircleUser },
  { name: "Web3 Wallet", href: "/services/web3-wallet", icon: Wallet },
  { name: "Drive", href: "/services/drive", icon: HardDrive },
  { name: "Web Hosting", href: "/services/web-hosting", icon: Server },
  { name: "Domain", href: "/services/domain", icon: Globe },
]

interface ServiceItemProps {
  href: string
  name: string
  icon: React.ElementType
  children: React.ReactNode
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 md:min-h-18 md:gap-3 md:py-0 lg:px-8">
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
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <LayoutGrid className="h-5 w-5" />
                  <span className="sr-only">Services</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Our Services</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <Link key={service.name} href={service.href} passHref>
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
            <Link href="/get-started">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
