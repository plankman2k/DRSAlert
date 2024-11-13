namespace DRSAlert.API.DTOs;

public class UserCredentialsDTO
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Location { get; set; } = null!;
}