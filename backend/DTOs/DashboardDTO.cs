namespace backend.DTOs;

public class DashboardStatsDTO
{
    public int TotalPosts { get; set; }
    public int PublishedPosts { get; set; }
    public int DraftPosts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalUsers { get; set; }
}
