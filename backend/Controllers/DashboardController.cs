using backend.data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        // Overall platform statistics (not user-specific)
        var totalPosts = await _context.Posts.CountAsync();
        var publishedPosts = await _context.Posts.CountAsync(p => p.Status.ToLower() == "published");
        var draftPosts = await _context.Posts.CountAsync(p => p.Status.ToLower() == "draft");
        var totalCategories = await _context.Categories.CountAsync();
        var totalUsers = await _context.Users.CountAsync();

        return Ok(new
        {
            totalPosts,
            publishedPosts,
            draftPosts,
            totalCategories,
            totalUsers
        });
    }
}
