"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { authService } from "@/lib/api/auth-service"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const storedUser = authService.getStoredUser()
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser)
        // Verify with server
        const serverUser = await authService.getCurrentUser()
        if (serverUser) {
          setUser(serverUser)
          localStorage.setItem("user", JSON.stringify(serverUser))
        } else {
          // Token invalid, clear storage
          await authService.logout()
          setUser(null)
        }
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
  }

  const register = async (name: string, email: string, password: string) => {
    await authService.register(name, email, password)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
