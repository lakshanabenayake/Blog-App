"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Skeleton } from "@/components/ui/skeleton"

function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background p-4">
        <Skeleton className="mb-8 h-8 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="ml-64">
        <div className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <main className="p-6">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <AdminLayoutSkeleton />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="ml-64">
        {/* <AdminHeader title="Admin Dashboard" email={user?.email} /> */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
