"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PenSquare, LogOut, User, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function BlogHeader() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
        
          <Link
            href="/blog"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/blog" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Blog
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === "Admin" ? (
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link href="/user/posts">My Posts</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "user" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/user/posts">
                          <FileText className="mr-2 h-4 w-4" />
                          My Posts
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user/posts/create">
                          <PenSquare className="mr-2 h-4 w-4" />
                          Create Post
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
