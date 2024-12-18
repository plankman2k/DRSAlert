namespace DRSAlert.API.DTOs;

public class DisasterDTO
{
    public int Id { get; set; }
    public string City { get; set; } = null!;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string DisasterType { get; set; } = null!;
    public double DisasterValue { get; set; }
}