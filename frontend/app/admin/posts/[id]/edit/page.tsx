"use client"

import { useEffect, useState, use } from "react"
import { notFound } from "next/navigation"
import { postsService } from "@/lib/api/posts-service"
import { categoriesService } from "@/lib/api/categories-service"
import { PostForm } from "@/components/admin/post-form"
import { Skeleton } from "@/components/ui/skeleton"
import type { Post, Category } from "@/lib/types"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

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

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [postData, categoriesData] = await Promise.all([postsService.getPostById(id), categoriesService.getAll()])
        setPost(postData)
        setCategories(categoriesData)
      } catch {
        setNotFoundError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return <FormSkeleton />
  }

  if (notFoundError || !post) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Edit Post</h2>
        <p className="text-muted-foreground">Update your blog post</p>
      </div>

      <PostForm post={post} categories={categories} />
    </div>
  )
}
