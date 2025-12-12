export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
  postCount?: number
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  categoryId: string | null
  tags: string[]
  status: "draft" | "published"
  userId: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface User {
  id: string
  email: string
  name: string
  role: "Admin" | "user"
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalCategories: number
}
