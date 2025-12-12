using backend.data;
using backend.DTOs;
using backend.Interfaces;
using backend.models;
using backend.Utilities;
using Microsoft.EntityFrameworkCore;

namespace backend.services;

public class PostService
{
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly AppDbContext _context;

    public PostService(IPostRepository postRepository, IUserRepository userRepository, AppDbContext context)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
        _context = context;
    }

    public async Task<PaginatedResponseDTO<PostResponseDTO>> GetAllPostsAsync(PostFiltersDTO filters)
    {
        var (posts, total) = await _postRepository.GetAllAsync(filters);

        return new PaginatedResponseDTO<PostResponseDTO>
        {
            Data = posts.Select(MapToResponseDTO).ToList(),
            Total = total,
            Page = filters.Page,
            PageSize = filters.PageSize,
            TotalPages = (int)Math.Ceiling(total / (double)filters.PageSize)
        };
    }

    public async Task<PaginatedResponseDTO<PostResponseDTO>> GetPublishedPostsAsync(PostFiltersDTO filters)
    {
        var (posts, total) = await _postRepository.GetPublishedAsync(filters);

        return new PaginatedResponseDTO<PostResponseDTO>
        {
            Data = posts.Select(MapToResponseDTO).ToList(),
            Total = total,
            Page = filters.Page,
            PageSize = filters.PageSize,
            TotalPages = (int)Math.Ceiling(total / (double)filters.PageSize)
        };
    }

    public async Task<PostResponseDTO?> GetPostByIdAsync(Guid id)
    {
        var post = await _postRepository.GetByIdAsync(id);
        return post != null ? MapToResponseDTO(post) : null;
    }

    public async Task<PostResponseDTO?> GetPostBySlugAsync(string slug)
    {
        var post = await _postRepository.GetBySlugAsync(slug);
        return post != null ? MapToResponseDTO(post) : null;
    }

    public async Task<List<PostResponseDTO>> GetRelatedPostsAsync(Guid postId, int categoryId, int limit)
    {
        var posts = await _postRepository.GetRelatedAsync(postId, categoryId, limit);
        return posts.Select(MapToResponseDTO).ToList();
    }

    public async Task<PostResponseDTO> CreatePostAsync(CreatePostDTO dto, Guid userId)
    {
        // Verify user exists
        var userExists = await _userRepository.GetByIdAsync(userId);
        if (userExists == null)
        {
            throw new InvalidOperationException($"User with ID {userId} does not exist");
        }

        // Generate unique slug
        var baseSlug = SlugGenerator.GenerateSlug(dto.Title);
        var slug = await GenerateUniqueSlugAsync(baseSlug);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            CategoryId = dto.CategoryId,
            UserId = userId,
            FeaturedImageUrl = dto.FeaturedImageUrl,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PublishedAt = dto.Status == "Published" ? DateTime.UtcNow : null
        };

        // Handle tags if provided
        if (dto.Tags != null && dto.Tags.Any())
        {
            post.Tags = await GetOrCreateTagsAsync(dto.Tags);
        }

        await _postRepository.AddAsync(post);
        return MapToResponseDTO(post);
    }

    public async Task<PostResponseDTO?> UpdatePostAsync(Guid id, UpdatePostDTO dto)
    {
        var post = await _postRepository.GetByIdAsync(id);
        if (post == null) return null;

        if (dto.Title != null)
        {
            post.Title = dto.Title;
            // Regenerate slug if title changed
            var baseSlug = SlugGenerator.GenerateSlug(dto.Title);
            var slug = await GenerateUniqueSlugAsync(baseSlug, id);
            post.Slug = slug;
        }
        if (dto.Content != null) post.Content = dto.Content;
        if (dto.CategoryId.HasValue) post.CategoryId = dto.CategoryId.Value;
        if (dto.FeaturedImageUrl != null) post.FeaturedImageUrl = dto.FeaturedImageUrl;

        if (dto.Status != null)
        {
            post.Status = dto.Status;
            if (dto.Status == "Published" && post.PublishedAt == null)
            {
                post.PublishedAt = DateTime.UtcNow;
            }
        }

        // Handle tags update
        if (dto.Tags != null)
        {
            post.Tags = await GetOrCreateTagsAsync(dto.Tags);
        }

        await _postRepository.UpdateAsync(post);
        return MapToResponseDTO(post);
    }

    public async Task<bool> DeletePostAsync(Guid id)
    {
        var exists = await _postRepository.ExistsAsync(id);
        if (!exists) return false;

        await _postRepository.DeleteAsync(id);
        return true;
    }

    public async Task<PaginatedResponseDTO<PostResponseDTO>> GetUserPostsAsync(Guid userId, PostFiltersDTO filters)
    {
        var (posts, total) = await _postRepository.GetByUserIdAsync(userId, filters);

        return new PaginatedResponseDTO<PostResponseDTO>
        {
            Data = posts.Select(MapToResponseDTO).ToList(),
            Total = total,
            Page = filters.Page,
            PageSize = filters.PageSize,
            TotalPages = (int)Math.Ceiling(total / (double)filters.PageSize)
        };
    }

    private async Task<string> GenerateUniqueSlugAsync(string baseSlug, Guid? excludePostId = null)
    {
        var counter = 0;
        var slug = baseSlug;

        while (true)
        {
            var existingPost = await _postRepository.GetBySlugAsync(slug);

            // If no post exists with this slug, or it's the same post we're updating
            if (existingPost == null || (excludePostId.HasValue && existingPost.Id == excludePostId.Value))
            {
                return slug;
            }

            // Generate new slug with counter
            counter++;
            slug = SlugGenerator.GenerateUniqueSlug(baseSlug, counter);
        }
    }

    private async Task<List<Tags>> GetOrCreateTagsAsync(List<string> tagNames)
    {
        var tags = new List<Tags>();

        foreach (var tagName in tagNames)
        {
            // Try to find existing tag
            var existingTag = await _context.Tags
                .FirstOrDefaultAsync(t => t.Name.ToLower() == tagName.ToLower());

            if (existingTag != null)
            {
                // Use existing tag
                tags.Add(existingTag);
            }
            else
            {
                // Create new tag
                var newTag = new Tags { Name = tagName };
                _context.Tags.Add(newTag);
                await _context.SaveChangesAsync();
                tags.Add(newTag);
            }
        }

        return tags;
    }

    private PostResponseDTO MapToResponseDTO(Post post)
    {
        return new PostResponseDTO
        {
            Id = post.Id,
            Title = post.Title,
            Slug = post.Slug,
            Content = post.Content,
            Excerpt = post.Content.Length > 200 ? post.Content.Substring(0, 200) + "..." : post.Content,
            FeaturedImage = post.FeaturedImageUrl,
            CategoryId = post.CategoryId,
            Category = post.Category != null ? new CategoryDTO
            {
                Id = post.Category.Id,
                Name = post.Category.Name,
                Slug = post.Category.Name.Replace(" ", "-").ToLower(),
                Description = post.Category.Description
            } : null,
            Tags = post.Tags?.Select(t => t.Name).ToList() ?? new List<string>(),
            Status = post.Status,
            UserId = post.UserId,
            PublishedAt = post.PublishedAt,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt
        };
    }
}
