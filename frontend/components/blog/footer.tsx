import { PenSquare } from "lucide-react"
import Link from "next/link"

export function BlogFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <PenSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">BlogSpace</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
