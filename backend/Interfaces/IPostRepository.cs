using backend.DTOs;
using backend.models;

namespace backend.Interfaces;

public interface IPostRepository
{
    Task<Post?> GetByIdAsync(Guid id);
    Task<Post?> GetBySlugAsync(string slug);
    Task<(List<Post> posts, int total)> GetAllAsync(PostFiltersDTO filters);
    Task<(List<Post> posts, int total)> GetPublishedAsync(PostFiltersDTO filters);
    Task<(List<Post> posts, int total)> GetByUserIdAsync(Guid userId, PostFiltersDTO filters);
    Task<List<Post>> GetRelatedAsync(Guid postId, int categoryId, int limit);
    Task<Post> AddAsync(Post post);
    Task UpdateAsync(Post post);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
