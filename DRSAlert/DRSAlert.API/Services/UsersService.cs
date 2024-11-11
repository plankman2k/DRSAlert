using DRSAlert.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DRSAlert.API.Services;

public class UsersService(IHttpContextAccessor httpContextAccessor,
    UserManager<ApplicationUser> userManager) : IUsersService
{
    public async Task<ApplicationUser> GetUser()
    {
        var emailClaim = httpContextAccessor.HttpContext!
            .User.Claims.FirstOrDefault(x => x.Type == "email");

        if (emailClaim is null)
        {
            return null;
        }

        var email = emailClaim.Value;
        return await userManager.FindByEmailAsync(email);
    }
}