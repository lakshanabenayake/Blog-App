import api from "./axios-client"
import type { Category } from "@/lib/types"

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories")
    return response.data
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },

  async getBySlug(slug: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/slug/${slug}`)
    return response.data
  },

  async create(category: Partial<Category>): Promise<Category> {
    const response = await api.post<Category>("/admin/categories", category)
    return response.data
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const response = await api.put<Category>(`/admin/categories/${id}`, category)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`)
  },
}
