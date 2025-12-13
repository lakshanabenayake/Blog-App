"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Layers, Users, Pencil, PenSquare } from "lucide-react"
import { postsService } from "@/lib/api"
import type { Post } from "@/lib/types"
import { format } from "date-fns"
import { BlogFooter } from "@/components/blog/footer"
import { useAuth } from "@/contexts/auth-context"

export default function LandingPage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        const response = await postsService.getPublishedPosts()
        setRecentPosts(response.data)
      } catch (error) {
        console.error("Failed to load recent posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRecentPosts()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* <PenSquare className="absolute left-4 top-4 h-12 w-12 text-primary" /> */}
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-background px-4 py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] " />
        <div className="container mx-auto max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 font-sans text-5xl font-bold leading-tight tracking-tight lg:text-7xl mb-7 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 w-fit px-8 py-4 rounded-2xl mx-auto border-1 border-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <PenSquare className="text-primary-500 drop-shadow-md w-12 h-12 lg:w-16 lg:h-16" strokeWidth={2.5} />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-primary drop-shadow-sm">
              BlogSpace
            </span>
          </div>

          <h1 className="mt-6 mb-6 text-balance font-sans text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
            Your Stories,
            <br />
            <span className="text-muted-foreground">Your Voice</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Discover compelling stories, insights, and ideas from writers around the world. A modern blog platform with
            an easy-to-use CMS for creators.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/blog">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href= {isAuthenticated ? "/user/posts" : "/auth/sign-up"}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Start Writing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold lg:text-4xl">
              Everything you need to share your ideas
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Built for writers, bloggers, and content creators who want a simple yet powerful platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden border-border p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Pencil className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Easy Content Creation</h3>
              <p className="leading-relaxed text-muted-foreground">
                Create and publish blog posts with a simple, intuitive editor. Write, format, and share your stories
                effortlessly.
              </p>
            </Card>

            {/* Feature 2 */}
            {/* <Card className="group relative overflow-hidden border-border p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Powerful CMS</h3>
              <p className="leading-relaxed text-muted-foreground">
                Manage all your content from a clean admin dashboard. Organize posts, categories, and track performance
                in one place.
              </p>
            </Card> */}

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden border-border p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Built for Readers</h3>
              <p className="leading-relaxed text-muted-foreground">
                Beautiful reading experience with search, filtering, and related content. Keep your audience engaged.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-4 text-balance text-3xl font-bold lg:text-4xl">Recent Stories</h2>
              <p className="text-pretty text-lg text-muted-foreground">Explore the latest content from our community</p>
            </div>
            <Link href="/blog">
              <Button variant="outline">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 animate-pulse bg-muted" />
                  <div className="p-6">
                    <div className="mb-3 h-4 w-20 animate-pulse rounded bg-muted" />
                    <div className="mb-3 h-6 animate-pulse rounded bg-muted" />
                    <div className="mb-4 space-y-2">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  </div>
                </Card>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={post.featuredImage || "/placeholder.svg"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-3 flex items-center gap-2">
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">
                            {post.category.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.publishedAt || post.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="mb-3 line-clamp-2 text-balance text-xl font-semibold group-hover:text-primary">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mb-4 line-clamp-3 flex-1 text-pretty leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-sm font-medium text-primary">
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No posts yet. Be the first to share your story!</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold lg:text-4xl">Ready to start your writing journey?</h2>
          <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground">
            Join our community of writers and readers. Create your account today and start sharing your stories with the
            world.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isAuthenticated && <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>}

            <Link href="/blog">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Explore Content
              </Button>
            </Link> 
          </div>
        </div>
      </section>

      {/* Footer */}
      <BlogFooter />
    </div>
  )
}
