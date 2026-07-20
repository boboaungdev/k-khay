import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-96 w-full max-w-sm" />
    </div>
  )
}
