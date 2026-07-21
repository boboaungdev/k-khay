import { PropsWithChildren } from "react"

import AccountSidebar from "@/features/account/components/AccountSidebar"

export default function AccountLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
        <AccountSidebar />
        <main className="w-full flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
