import api from "./axios-client"
import type { DashboardStats } from "@/lib/types"

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>("/admin/dashboard/stats")
    return response.data
  },
}
