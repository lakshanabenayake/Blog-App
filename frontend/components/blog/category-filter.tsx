"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set("category", slug)
      params.delete("page") // Reset to page 1 when filtering
    } else {
      params.delete("category")
    }
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={!activeCategory ? "default" : "outline"} size="sm" onClick={() => handleCategoryClick(null)}>
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.name)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
