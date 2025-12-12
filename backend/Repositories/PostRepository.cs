using backend.data;
using backend.DTOs;
using backend.Interfaces;
using backend.models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class PostRepository : IPostRepository
{
    private readonly AppDbContext _context;

    public PostRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Post?> GetByIdAsync(Guid id)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Post?> GetBySlugAsync(string slug)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Slug == slug.ToLower());
    }

    public async Task<(List<Post> posts, int total)> GetAllAsync(PostFiltersDTO filters)
    {
        var query = _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Tags)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(filters.Search))
        {
            query = query.Where(p => p.Title.Contains(filters.Search) || p.Content.Contains(filters.Search));
        }

        if (filters.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filters.CategoryId.Value);
        }

        if (!string.IsNullOrEmpty(filters.Status))
        {
            query = query.Where(p => p.Status == filters.Status);
        }

        var total = await query.CountAsync();

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return (posts, total);
    }

    public async Task<(List<Post> posts, int total)> GetPublishedAsync(PostFiltersDTO filters)
    {
        var query = _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Tags)
            .Where(p => p.Status == "Published")
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(filters.Search))
        {
            query = query.Where(p => p.Title.Contains(filters.Search) || p.Content.Contains(filters.Search));
        }

        if (!string.IsNullOrEmpty(filters.CategorySlug))
        {
            query = query.Where(p => p.Category.Name.Replace(" ", "-").ToLower() == filters.CategorySlug.ToLower());
        }

        var total = await query.CountAsync();

        var posts = await query
            .OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return (posts, total);
    }

    public async Task<(List<Post> posts, int total)> GetByUserIdAsync(Guid userId, PostFiltersDTO filters)
    {
        var query = _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Tags)
            .Where(p => p.UserId == userId)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(filters.Search))
        {
            query = query.Where(p => p.Title.Contains(filters.Search) || p.Content.Contains(filters.Search));
        }

        if (!string.IsNullOrEmpty(filters.Status))
        {
            query = query.Where(p => p.Status == filters.Status);
        }

        var total = await query.CountAsync();

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return (posts, total);
    }

    public async Task<List<Post>> GetRelatedAsync(Guid postId, int categoryId, int limit)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Category)
            .Include(p => p.Tags)
            .Where(p => p.Id != postId && p.CategoryId == categoryId && p.Status == "Published")
            .OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Post> AddAsync(Post post)
    {
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return post;
    }

    public async Task UpdateAsync(Post post)
    {
        post.UpdatedAt = DateTime.UtcNow;
        _context.Posts.Update(post);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var post = await GetByIdAsync(id);
        if (post != null)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Posts.AnyAsync(p => p.Id == id);
    }
}
