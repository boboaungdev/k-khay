import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AuthCard({
  title,
  description,
  error,
  children,
}: {
  title: string
  description: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        ) : null}
        {children}
      </CardContent>
    </Card>
  )
}
