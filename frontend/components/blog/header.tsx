"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BlogHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <PenSquare className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">BlogSpace</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Button asChild size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
