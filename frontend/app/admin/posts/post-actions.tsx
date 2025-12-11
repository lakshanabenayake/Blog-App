"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import type { Post } from "@/lib/types"

interface PostActionsProps {
  post: Post
  onDeleted?: () => void
}

export function PostActions({ post, onDeleted }: PostActionsProps) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDelete(true)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
      <DeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        type="post"
        id={post.id}
        title={post.title}
        onDeleted={onDeleted}
      />
    </>
  )
}
