using Microsoft.EntityFrameworkCore;

namespace DRSAlert.API;

public class ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : DbContext(options)
{
    // DbSets go here
}