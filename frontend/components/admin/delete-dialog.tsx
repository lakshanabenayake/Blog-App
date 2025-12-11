"use client"

import { useState } from "react"
import { postsService } from "@/lib/api/posts-service"
import { categoriesService } from "@/lib/api/categories-service"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "post" | "category"
  id: string
  title: string
  onDeleted?: () => void
}

export function DeleteDialog({ open, onOpenChange, type, id, title, onDeleted }: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      if (type === "post") {
        await postsService.deletePost(id)
      } else {
        await categoriesService.delete(id)
      }
      toast.success(`${type === "post" ? "Post" : "Category"} deleted successfully`)
      onOpenChange(false)
      onDeleted?.()
    } catch (err) {
      console.error("Delete error:", err)
      toast.error(`Failed to delete ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">&quot;{title}&quot;</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
