namespace backend.DTOs;

public class CreatePostDTO
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string? Excerpt { get; set; }
    public int CategoryId { get; set; }
    public List<string>? Tags { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string Status { get; set; } = "Draft";
}

public class UpdatePostDTO
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public int? CategoryId { get; set; }
    public List<string>? Tags { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string? Status { get; set; }
}

public class PostResponseDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string? Excerpt { get; set; }
    public string? FeaturedImage { get; set; }
    public int? CategoryId { get; set; }
    public CategoryDTO? Category { get; set; }
    public List<string> Tags { get; set; } = new();
    public string Status { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CategoryDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
}

public class PaginatedResponseDTO<T>
{
    public List<T> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class PostFiltersDTO
{
    public string? Search { get; set; }
    public int? CategoryId { get; set; }
    public string? CategorySlug { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
