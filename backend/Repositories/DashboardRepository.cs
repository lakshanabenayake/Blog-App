using backend.data;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly AppDbContext _context;

    public DashboardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetTotalPostsCountAsync()
    {
        return await _context.Posts.CountAsync();
    }

    public async Task<int> GetPublishedPostsCountAsync()
    {
        return await _context.Posts.CountAsync(p => p.Status.ToLower() == "published");
    }

    public async Task<int> GetDraftPostsCountAsync()
    {
        return await _context.Posts.CountAsync(p => p.Status.ToLower() == "draft");
    }

    public async Task<int> GetTotalCategoriesCountAsync()
    {
        return await _context.Categories.CountAsync();
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        return await _context.Users.CountAsync();
    }
}
