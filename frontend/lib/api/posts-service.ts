import axiosClient from "./axios-client"
import type { Post, PaginatedResponse } from "@/lib/types"

export interface PostFilters {
  search?: string
  categoryId?: string
  categorySlug?: string
  status?: "draft" | "published"
  page?: number
  pageSize?: number
}

export const postsService = {
  // Public endpoints
  async getPublishedPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.categorySlug) params.append("categorySlug", filters.categorySlug)
    if (filters?.page) params.append("page", String(filters.page))
    if (filters?.pageSize) params.append("pageSize", String(filters.pageSize))

    const response = await axiosClient.get<PaginatedResponse<Post>>(`/posts?${params}`)
    return response.data
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const response = await axiosClient.get<Post>(`/posts/slug/${slug}`)
    return response.data
  },

  async getRelatedPosts(postId: string, categoryId: string, limit = 3): Promise<Post[]> {
    const response = await axiosClient.get<Post[]>(`/posts/${postId}/related?categoryId=${categoryId}&limit=${limit}`)
    return response.data
  },

  // Admin endpoints
  async getAllPosts(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.categoryId) params.append("categoryId", filters.categoryId)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.page) params.append("page", String(filters.page))
    if (filters?.pageSize) params.append("pageSize", String(filters.pageSize))

    const response = await axiosClient.get<PaginatedResponse<Post>>(`/admin/posts?${params}`)
    return response.data
  },

  async getPostById(id: string): Promise<Post> {
    const response = await axiosClient.get<Post>(`/admin/posts/${id}`)
    return response.data
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const response = await axiosClient.post<Post>("/admin/posts", post)
    return response.data
  },

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const response = await axiosClient.put<Post>(`/admin/posts/${id}`, post)
    return response.data
  },

  async deletePost(id: string): Promise<void> {
    await axiosClient.delete(`/admin/posts/${id}`)
  },
}
