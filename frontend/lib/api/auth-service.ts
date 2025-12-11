import axiosClient from "./axios-client"
import type { AuthResponse, User } from "@/lib/types"

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    })
    const data = response.data

    localStorage.setItem("auth_token", data.token)
    localStorage.setItem("refresh_token", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  },

  async register(name: string, email: string, password: string): Promise<{ message: string }> {
    const response = await axiosClient.post<{ message: string }>("/auth/register", {
      name,
      email,
      password,
    })
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await axiosClient.post("/auth/logout")
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosClient.get<User>("/auth/me")
      return response.data
    } catch {
      return null
    }
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  },
}
