"use client"

import { useEffect, useState, use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { postsService } from "@/lib/api/posts-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RelatedPosts } from "@/components/blog/related-posts"
import type { Post } from "@/lib/types"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

function PostSkeleton() {
  return (
    <article className="container mx-auto px-4 py-8">
      <Skeleton className="mb-6 h-10 w-32" />
      <header className="mb-8">
        <Skeleton className="mb-4 h-6 w-24" />
        <Skeleton className="mb-4 h-12 w-3/4" />
        <Skeleton className="h-5 w-48" />
      </header>
      <Skeleton className="mb-8 aspect-video w-full rounded-lg" />
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  )
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true)
      try {
        const postData = await postsService.getPostBySlug(slug)
        setPost(postData)

        if (postData.categoryId) {
          const related = await postsService.getRelatedPosts(postData.id, postData.categoryId, 3)
          setRelatedPosts(related)
        }
      } catch {
        setNotFoundError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (isLoading) {
    return <PostSkeleton />
  }

  if (notFoundError || !post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to posts
        </Link>
      </Button>

      <header className="mb-8">
        {post.category && (
          <Badge variant="secondary" className="mb-4">
            {post.category.name}
          </Badge>
        )}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishedAt || post.createdAt}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{post.tags.join(", ")}</span>
            </div>
          )}
        </div>
      </header>

      {post.featuredImage && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-gray mx-auto max-w-3xl dark:prose-invert">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <RelatedPosts posts={relatedPosts} />
    </article>
  )
}
