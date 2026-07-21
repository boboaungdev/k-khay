import { PropsWithChildren } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AccountSidebar from "@/features/account/components/AccountSidebar"

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:px-6 lg:px-8">
        <div className="flex">
          <AccountSidebar />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
