import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0">
        {/* Sidebar Skeleton */}
        <aside className="hidden w-1/4 md:block">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </aside>

        {/* Mobile Sidebar Skeleton */}
        <div className="mb-4 md:hidden">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Main Content Skeleton */}
        <main className="w-full flex-1 space-y-6">
          <div>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    </div>
  )
}
