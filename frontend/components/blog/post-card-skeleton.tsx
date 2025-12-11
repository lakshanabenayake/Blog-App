import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-5 w-20" />
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="border-t px-4 py-3">
        <Skeleton className="h-3 w-32" />
      </CardFooter>
    </Card>
  )
}
