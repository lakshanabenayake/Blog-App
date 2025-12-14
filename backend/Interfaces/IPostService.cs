using backend.services;
using backend.DTOs;
namespace backend.Interfaces;

public interface IPostService
{
    Task<PaginatedResponseDTO<PostResponseDTO>> GetAllPostsAsync(PostFiltersDTO filters);
    Task<PaginatedResponseDTO<PostResponseDTO>> GetPublishedPostsAsync(PostFiltersDTO filters);
    Task<PostResponseDTO?> GetPostByIdAsync(Guid id);
    Task<PostResponseDTO?> GetPostBySlugAsync(string slug);
}   