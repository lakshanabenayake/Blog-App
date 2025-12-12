"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/blog?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    // Always show first page
    pages.push(1)

    // Show ellipsis or page 2
    if (showEllipsisStart) {
      pages.push("...")
    } else if (totalPages > 1) {
      pages.push(2)
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Show ellipsis or second to last page
    if (showEllipsisEnd) {
      pages.push("...")
    } else if (totalPages > 2 && !pages.includes(totalPages - 1)) {
      pages.push(totalPages - 1)
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, total)} of {total} posts
      </p>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              className="min-w-10"
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 text-muted-foreground">
              {page}
            </span>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}
