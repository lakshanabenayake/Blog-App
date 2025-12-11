import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Posts | BlogSpace",
  description: "Manage your blog posts",
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
