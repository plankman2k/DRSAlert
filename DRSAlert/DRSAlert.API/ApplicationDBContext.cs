using DRSAlert.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DRSAlert.API;

public class ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : IdentityDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Fluent API configurations go here

        modelBuilder.Entity<IdentityUser>().ToTable("Users");
        modelBuilder.Entity<IdentityRole>().ToTable("Roles");
        modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
        modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
    }
    
    // DbSets go here
    public DbSet<Disaster> Disasters { get; set; }
}