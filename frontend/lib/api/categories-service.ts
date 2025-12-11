import axiosClient from "./axios-client"
import type { Category } from "@/lib/types"

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await axiosClient.get<Category[]>("/categories")
    return response.data
  },

  async getById(id: string): Promise<Category> {
    const response = await axiosClient.get<Category>(`/categories/${id}`)
    return response.data
  },

  async getBySlug(slug: string): Promise<Category> {
    const response = await axiosClient.get<Category>(`/categories/slug/${slug}`)
    return response.data
  },

  async create(category: Partial<Category>): Promise<Category> {
    const response = await axiosClient.post<Category>("/admin/categories", category)
    return response.data
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const response = await axiosClient.put<Category>(`/admin/categories/${id}`, category)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axiosClient.delete(`/admin/categories/${id}`)
  },
}
