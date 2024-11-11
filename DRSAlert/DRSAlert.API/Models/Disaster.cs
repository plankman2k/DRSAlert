namespace DRSAlert.API.Models;

public class Disaster
{
    public string city { get; set; }
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string disaster_field { get; set; }
    public double disaster_value { get; set; }
}
