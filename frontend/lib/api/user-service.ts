import api from "./axios-client"
import type { User } from "@/lib/types"

export const userService = {
  async updateProfile(data: { username?: string; profilePictureUrl?: string }): Promise<User> {
    const response = await api.put<User>("/auth/profile", data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me")
    return response.data
  },
}
