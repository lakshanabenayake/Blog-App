import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RelatedPosts } from "@/components/blog/related-posts"
import { AuthorBox } from "@/components/blog/author-box"
import type { Post } from "@/lib/types"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

// Server-side data fetching
async function fetchPostData(slug: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.blogapp.lakshanabenayake.me/api"
  
  try {
    const postRes = await fetch(`${API_BASE_URL}/posts/slug/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!postRes.ok) {
      return null
    }
    
    const post: Post = await postRes.json()
    
    // Fetch related posts if category exists
    let relatedPosts: Post[] = []
    if (post.categoryId) {
      const relatedRes = await fetch(
        `${API_BASE_URL}/posts/${post.id}/related?categoryId=${post.categoryId}&limit=3`,
        { next: { revalidate: 60 } }
      )
      if (relatedRes.ok) {
        relatedPosts = await relatedRes.json()
      }
    }
    
    return { post, relatedPosts }
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchPostData(slug)
  
  if (!data?.post) {
    return {
      title: "Post Not Found",
    }
  }
  
  const { post } = data
  
  return {
    title: `${post.title} | BlogSpace`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const data = await fetchPostData(slug)

  if (!data?.post) {
    notFound()
  }

  const { post, relatedPosts } = data

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
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg max-w-8xl">
          <Image
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <AuthorBox author={post.user} publishedAt={post.publishedAt} />

      <div className="prose prose-gray  max-w-3xl dark:prose-invert">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <RelatedPosts posts={relatedPosts} />
    </article>
  )
}
