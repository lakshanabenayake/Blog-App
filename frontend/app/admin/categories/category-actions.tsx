"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CategoryForm } from "@/components/admin/category-form"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import type { Category } from "@/lib/types"

interface CategoryActionsProps {
  category?: Category
  onCategoryChanged?: () => void
}

export function CategoryActions({ category, onCategoryChanged }: CategoryActionsProps) {
  const [showForm, setShowForm] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleSuccess = () => {
    setShowForm(false)
    onCategoryChanged?.()
  }

  if (!category) {
    return (
      <>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
        <CategoryForm open={showForm} onOpenChange={setShowForm} onSuccess={handleSuccess} />
      </>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setShowForm(true)}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDelete(true)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      <CategoryForm category={category} open={showForm} onOpenChange={setShowForm} onSuccess={handleSuccess} />
      <DeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        type="category"
        id={category.id}
        title={category.name}
        onDeleted={onCategoryChanged}
      />
    </>
  )
}
