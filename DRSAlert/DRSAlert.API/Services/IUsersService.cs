using Microsoft.AspNetCore.Identity;

namespace DRSAlert.API.Services;

public interface IUsersService
{
    Task<IdentityUser?> GetUser();
}