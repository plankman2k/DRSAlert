namespace DRSAlert.API.DTOs;

public class CreateNewsFeedDTO
{
    public string Author { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Url { get; set; } = null!;
    public string Source { get; set; } = null!;
    public string? Image { get; set; }
    public string Category { get; set; } = null!;
    public string Language { get; set; } = null!;
    public string Country { get; set; } = null!;
    public DateTime PublishedAt { get; set; }
}