"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ACCOUNT_CATEGORIES } from "@/features/account/constants/account.constants"

const categories = ACCOUNT_CATEGORIES.filter(
  (category) => category.id !== "home"
).map((category) =>
  category.id === "userinfo" ? { ...category, id: "profile" } : category
)

export default function AccountSidebar() {
  const pathname = usePathname()

  const activeCategory =
    categories.find((c) => pathname.includes(c.id))?.id ?? "profile"

  return (
    <Sidebar variant="inset" className="top-[4rem] h-auto md:top-[4.5rem]">
      <SidebarHeader>
        <span className="text-xl font-semibold">Menu</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {categories.map((category) => (
            <SidebarMenuItem key={category.id}>
              <SidebarMenuButton
                render={<Link href={`/account/${category.id}`} />}
                isActive={activeCategory === category.id}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

