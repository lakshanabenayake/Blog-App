"use client"

import { useEffect, useState } from "react"
import { categoriesService } from "@/lib/api/categories-service"
import { PostForm } from "@/components/admin/post-form"
import { Skeleton } from "@/components/ui/skeleton"
import type { Category } from "@/lib/types"

function FormSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

export default function NewPostPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesService.getAll()
        setCategories(data)
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return <FormSkeleton />
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create New Post</h2>
        <p className="text-muted-foreground">Write and publish a new blog post</p>
      </div>

      <PostForm categories={categories} />
    </div>
  )
}
