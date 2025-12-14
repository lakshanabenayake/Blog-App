using backend.DTOs;

namespace backend.Interfaces;

public interface IPostService
{
    Task<PaginatedResponseDTO<PostResponseDTO>> GetAllPostsAsync(PostFiltersDTO filters);
    Task<PaginatedResponseDTO<PostResponseDTO>> GetPublishedPostsAsync(PostFiltersDTO filters);
    Task<PostResponseDTO?> GetPostByIdAsync(Guid id);
    Task<PostResponseDTO?> GetPostBySlugAsync(string slug);
    Task<List<PostResponseDTO>> GetRelatedPostsAsync(Guid postId, int categoryId, int limit);
    Task<PostResponseDTO> CreatePostAsync(CreatePostDTO dto, Guid userId);
    Task<PostResponseDTO?> UpdatePostAsync(Guid id, UpdatePostDTO dto);
    Task<bool> DeletePostAsync(Guid id);
    Task<PaginatedResponseDTO<PostResponseDTO>> GetUserPostsAsync(Guid userId, PostFiltersDTO filters);
}