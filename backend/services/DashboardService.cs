using backend.DTOs;
using backend.Interfaces;

namespace backend.services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;

    public DashboardService(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<DashboardStatsDTO> GetDashboardStatsAsync()
    {
        var totalPosts = await _dashboardRepository.GetTotalPostsCountAsync();
        var publishedPosts = await _dashboardRepository.GetPublishedPostsCountAsync();
        var draftPosts = await _dashboardRepository.GetDraftPostsCountAsync();
        var totalCategories = await _dashboardRepository.GetTotalCategoriesCountAsync();
        var totalUsers = await _dashboardRepository.GetTotalUsersCountAsync();

        return new DashboardStatsDTO
        {
            TotalPosts = totalPosts,
            PublishedPosts = publishedPosts,
            DraftPosts = draftPosts,
            TotalCategories = totalCategories,
            TotalUsers = totalUsers
        };
    }
}
