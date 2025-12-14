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
      <Button 
        variant={!activeCategory ? "default" : "outline"} 
        size="sm" 
        onClick={() => handleCategoryClick(null)}
        className={!activeCategory ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.name ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.name)}
          className={activeCategory === category.name ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
