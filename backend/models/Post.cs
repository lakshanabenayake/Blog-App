

using backend.models;

public class Post
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string? FeaturedImageUrl { get; set; }
    public List<Tags?> Tags { get; set; } = new List<Tags?>();  
    public string Status { get; set; } = "Draft";
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// enum PostStatus
// {
//     Draft,
//     Published,
//     Archived
// }