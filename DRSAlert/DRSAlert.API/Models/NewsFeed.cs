namespace DRSAlert.API.Models;

public class NewsFeed
{
    public string author { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public string url { get; set; }
    public string source { get; set; }
    public object image { get; set; }
    public string category { get; set; }
    public string language { get; set; }
    public string country { get; set; }
    public string published_at { get; set; }
}

