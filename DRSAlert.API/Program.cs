using DRSAlert.API;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(configuraton =>
    {
        configuraton.WithOrigins(builder.Configuration["allowedOrigins"]!).AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddOutputCache();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

app.UseCors();
app.UseOutputCache();
app.UseSerilogRequestLogging();

app.UseAuthorization();

app.MapGet("/", () => "Hello World!").RequireAuthorization();

await app.RunAsync();
