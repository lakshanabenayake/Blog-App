import Image from "next/image"
import Link from "next/link"
import { Calendar, PenSquare } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <PenSquare className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {post.category && (
          <Badge variant="secondary" className="mb-2">
            {post.category.name}
          </Badge>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
      </CardContent>
      <CardFooter className="border-t px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <time dateTime={post.publishedAt || post.createdAt}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </CardFooter>
    </Card>
  )
}
