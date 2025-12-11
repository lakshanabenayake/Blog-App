import { FileText, PenSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  showCreateButton?: boolean
}

export function EmptyState({ title, description, showCreateButton = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      {showCreateButton && (
        <Button asChild>
          <Link href="/user/posts/create">
            <PenSquare className="mr-2 h-4 w-4" />
            Create Your First Post
          </Link>
        </Button>
      )}
    </div>
  )
}
