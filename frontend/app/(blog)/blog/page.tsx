"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { postsService } from "@/lib/api/posts-service"
import { categoriesService } from "@/lib/api/categories-service"
import { SearchBar } from "@/components/blog/search-bar"
import { CategoryFilter } from "@/components/blog/category-filter"
import { PostCard } from "@/components/blog/post-card"
import { PostCardSkeleton } from "@/components/blog/post-card-skeleton"
import { EmptyState } from "@/components/blog/empty-state"
import { Pagination } from "@/components/blog/pagination"
import type { Category, Post } from "@/lib/types"

function PostsGrid({ posts, isLoading }: { posts: Post[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts found"
        description="Try adjusting your search or filters, or check back later for new content"
        showCreateButton={true}
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function BlogContent() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 12, totalPages: 0 })

  const query = searchParams.get("q") || undefined
  const category = searchParams.get("category") || undefined
  const page = parseInt(searchParams.get("page") || "1", 10)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [postsResponse, categoriesData] = await Promise.all([
        postsService.getPublishedPosts({ 
          search: query, 
          categorySlug: category,
          page,
          pageSize: 12
        }),
        categoriesService.getAll(),
      ])
      console.log(postsResponse.data);
      setPosts(postsResponse.data)
      setCategories(categoriesData)
      setPagination({
        total: postsResponse.total,
        page: postsResponse.page,
        pageSize: postsResponse.pageSize,
        totalPages: postsResponse.totalPages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts")
    } finally {
      setIsLoading(false)
    }
  }, [query, category, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
          All Blog Posts
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
          Discover stories, insights, and ideas from writers around the world
        </p>
      </section>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <CategoryFilter categories={categories} />
      </div>

      {error ? (
        <EmptyState title="Error loading posts" description={error} />
      ) : (
        <>
          <PostsGrid posts={posts} isLoading={isLoading} />
          {!isLoading && posts.length > 0 && (
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages}
              total={pagination.total}
            />
          )}
        </>
      )}
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  )
}
