"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { User as UserIcon } from "lucide-react"
import type { User } from "@/lib/types"

interface AuthorBoxProps {
  author?: User
  publishedAt?: string | null
}

export function AuthorBox({ author, publishedAt }: AuthorBoxProps) {
  if (!author) return null

  const initials = author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <Card className="my-8">
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={author.profilePictureUrl || undefined} alt={author.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {author.profilePictureUrl ? <UserIcon className="h-8 w-8" /> : initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Written by</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{author.name}</h3>
          {formattedDate && <p className="text-sm text-muted-foreground">Published on {formattedDate}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
