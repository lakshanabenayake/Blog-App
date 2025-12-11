import axiosClient from "./axios-client"
import type { DashboardStats } from "@/lib/types"

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await axiosClient.get<DashboardStats>("/admin/dashboard/stats")
    return response.data
  },
}
