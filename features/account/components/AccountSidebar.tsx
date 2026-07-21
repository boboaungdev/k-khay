"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ACCOUNT_CATEGORIES } from "@/features/account/constants/account.constants"
import { cn } from "@/lib/utils"

const categories = ACCOUNT_CATEGORIES

export default function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const activeCategory =
    categories.find((c) =>
      c.id === "home"
        ? pathname === "/account" || pathname === "/account/" // Handle both /account and /account/
        : pathname.includes(`/account/${c.id}`)
    )?.id ?? "profile"

  const handleCategoryChange = (categoryId: string | null) => {
    if (categoryId) {
      if (categoryId === "home") {
        router.push("/account")
      } else {
        router.push(`/account/${categoryId}`)
      }
    }
  }

  return (
    <>
      <aside className="hidden w-1/4 md:block">
        <nav className="flex flex-col gap-2">
          {categories.map((category) => {
            const href =
              category.id === "home" ? "/account" : `/account/${category.id}`
            return (
              <Link
                key={category.id}
                href={href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start gap-3 px-3",
                  activeCategory === category.id &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="mb-4 md:hidden">
        <Select value={activeCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Menu">
              {(() => {
                const activeCategoryDetails = categories.find(
                  (c) => c.id === activeCategory
                )
                if (!activeCategoryDetails) {
                  return null
                }
                const Icon = activeCategoryDetails.icon
                return (
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{activeCategoryDetails.label}</span>
                  </div>
                )
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-3">
                  <category.icon className="h-5 w-5" />
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
