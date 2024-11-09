using DRSAlert.API;
using DRSAlert.API.Endpoints;
using DRSAlert.API.Services;
using DRSAlert.API.Utilities;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDBContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<IdentityUser>>();
builder.Services.AddScoped<SignInManager<IdentityUser>>();

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

builder.Services.AddTransient<IUsersService, UsersService>();

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
        { 
            Title = "DRSAlert.API", 
            Version = "v1",
            Description = "This is the API to handle communication for the DRSAlert system",
            Contact = new Microsoft.OpenApi.Models.OpenApiContact
            {
                Name = "Jason Plank",
                Email = "plank.jason@outlook.com"
            },
            License = new Microsoft.OpenApi.Models.OpenApiLicense
            {
                Name = "MIT",
                Url = new Uri("https://opensource.org/licenses/MIT")
            }
        });
    
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        Scheme = "Bearer",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });       
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {   
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddAuthentication().AddJwtBearer(options => 
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        //IssuerSigningKeys = KeysHandler.GetAllKeys(builder.Configuration)
        IssuerSigningKey = KeysHandler.GetKey(builder.Configuration).First()
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("isadmin", policy => policy.RequireClaim("isadmin"));
});

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseOutputCache();
app.UseSerilogRequestLogging();

app.UseAuthorization();

app.MapGet("/", () => "Hello World!").RequireAuthorization();

app.MapGroup("/users").MapUsers();

await app.RunAsync();
