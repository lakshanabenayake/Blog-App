namespace backend.Interfaces;

public interface IDashboardRepository
{
    Task<int> GetTotalPostsCountAsync();
    Task<int> GetPublishedPostsCountAsync();
    Task<int> GetDraftPostsCountAsync();
    Task<int> GetTotalCategoriesCountAsync();
    Task<int> GetTotalUsersCountAsync();
}
