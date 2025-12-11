import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PostNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 rounded-full bg-muted p-6">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mb-4 text-3xl font-bold text-foreground">Post Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The post you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
