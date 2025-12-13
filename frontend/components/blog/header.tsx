"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { PenSquare, LogOut, User, FileText, Menu } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

export function BlogHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  
  const handleClick = () => {
    router.push("/user/profile")
  }

  const NavLinks = () => (
    <>
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Home
      </Link>
      <Link
        href="/blog"
        onClick={() => setOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === "/blog" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Blog
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* <PenSquare className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">BlogSpace</span> */}
          <img
            src="/logo.svg"
            alt="BlogSpace Logo"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />

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
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <button onClick={e=> handleClick()}>My account</button>
                  </DropdownMenuLabel>
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

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <NavLinks />
              
              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-4">
                      Welcome, {user?.name}
                    </p>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setOpen(false)}
                      >
                        <Link href="/user/profile">
                          <User className="mr-2 h-4 w-4" />
                          My Account
                        </Link>
                      </Button>

                      {user?.role === "Admin" ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin">Admin Dashboard</Link>
                        </Button>
                      ) : (
                        <>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setOpen(false)}
                          >
                            <Link href="/user/posts">
                              <FileText className="mr-2 h-4 w-4" />
                              My Posts
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setOpen(false)}
                          >
                            <Link href="/user/posts/create">
                              <PenSquare className="mr-2 h-4 w-4" />
                              Create Post
                            </Link>
                          </Button>
                        </>
                      )}

                      <Button
                        variant="destructive"
                        className="w-full justify-start mt-4"
                        onClick={() => {
                          logout()
                          setOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
