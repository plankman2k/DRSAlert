using DRSAlert.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DRSAlert.API.Services;

public interface IUsersService
{
    Task<ApplicationUser?> GetUser();
}