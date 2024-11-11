using Microsoft.AspNetCore.Identity;

namespace DRSAlert.API.Models;

public class ApplicationUser : IdentityUser
{
    public string Location { get; set; } = null!;
}