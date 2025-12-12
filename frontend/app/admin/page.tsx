"use client"

import { useEffect, useState } from "react"
import { dashboardService } from "@/lib/api/dashboard-service"
import { StatsCard } from "@/components/admin/stats-card"
import { FileText, FolderOpen, Eye, FileEdit, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardStats } from "@/lib/types"

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-1 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await dashboardService.getStats()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">Platform-wide statistics and overview</p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Posts"
            value={stats?.totalPosts || 0}
            icon={FileText}
            description="All posts on platform"
          />
          <StatsCard title="Published" value={stats?.publishedPosts || 0} icon={Eye} description="Live posts" />
          <StatsCard title="Drafts" value={stats?.draftPosts || 0} icon={FileEdit} description="Unpublished posts" />
          <StatsCard
            title="Categories"
            value={stats?.totalCategories || 0}
            icon={FolderOpen}
            description="Total categories"
          />
          <StatsCard
            title="Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            description="Registered users"
          />
        </div>
      )}
    </div>
  )
}
