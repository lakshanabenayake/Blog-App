import type React from "react"
import { BlogFooter } from "@/components/blog/footer"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  )
}
