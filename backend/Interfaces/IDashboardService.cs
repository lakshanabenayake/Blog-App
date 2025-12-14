using backend.DTOs;

namespace backend.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDTO> GetDashboardStatsAsync();
}
