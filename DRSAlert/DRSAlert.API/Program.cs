using DRSAlert.API;
using DRSAlert.API.Endpoints;
using DRSAlert.API.Repositories;
using DRSAlert.API.Services;
using DRSAlert.API.Utilities;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using DRSAlert.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDBContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<ApplicationUser>>();
builder.Services.AddScoped<SignInManager<ApplicationUser>>();

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
builder.Services.AddScoped<IDisasterRepository, DisasterRepository>();
builder.Services.AddScoped<INewsFeedRepository, NewsFeedRepository>();

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
app.MapGroup("/disasters").MapDisasters();
app.MapGroup("/newsfeeds").MapNewsFeeds();

// RabbitMQ Configuration
var factory = new ConnectionFactory { HostName = "102.211.204.21", UserName = "queue_user", Password = "queue_password" };
using var connection1 = await factory.CreateConnectionAsync();
using var channel1 = await connection1.CreateChannelAsync();

await channel1.QueueDeclareAsync(queue: "weather_disaster",
    durable: false,
    exclusive: false,
    autoDelete: false,
    arguments: null);

var consumer1 = new AsyncEventingBasicConsumer(channel1);
consumer1.ReceivedAsync += async (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);

    // Handle message here - Insert to DB, use DisastersRepository.
    var disaster = JsonSerializer.Deserialize<Disaster>(message);

    if (disaster is not null)
    {
        Log.Information("Storing disaster info: {Disaster}", disaster.city);
        using (var scope = app.Services.CreateScope())
        {
            // create a new instace if DisasterRepository
            var disasterRepository = scope.ServiceProvider.GetRequiredService<IDisasterRepository>();
        
            var disasterToInsert = new DRSAlert.API.Entities.Disaster
            {
                City = disaster.city,
                Latitude = disaster.latitude,
                Longitude = disaster.longitude,
                DisasterType = disaster.disaster_field,
                DisasterValue = disaster.disaster_value
            };
        
            // Insert the disasterToInser object to the database
            await disasterRepository.Create(disasterToInsert);
        }
        
    }
};

await channel1.BasicConsumeAsync(queue: "weather_disaster",
    autoAck: true,
    consumer: consumer1);

using var connection2 = await factory.CreateConnectionAsync();
using var channel2 = await connection2.CreateChannelAsync();

await channel2.QueueDeclareAsync(queue: "news",
    durable: false,
    exclusive: false,
    autoDelete: false,
    arguments: null);

var consumer2 = new AsyncEventingBasicConsumer(channel2);
consumer2.ReceivedAsync += async (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);

    // Deserialize message to a NewsFeed object
    var newsFeed = JsonSerializer.Deserialize<NewsFeed>(message);

    if (newsFeed is not null)
    {
        using (var scope = app.Services.CreateScope())
        {
            Log.Information("Storing article info: {NewsFeed}", newsFeed.title);
            
            // create a new instance of NewsFeedRepository
            var newsFeedRepository = scope.ServiceProvider.GetRequiredService<INewsFeedRepository>();

            var newsFeedToInsert = new DRSAlert.API.Entities.NewsFeed
            {
                Author = newsFeed.author,
                Title = newsFeed.title,
                Description = newsFeed.description,
                Url = newsFeed.url,
                Source = newsFeed.source,
                Image = newsFeed.image?.ToString(),
                Category = newsFeed.category,
                Language = newsFeed.language,
                Country = newsFeed.country,
                PublishedAt = Convert.ToDateTime(newsFeed.published_at)
            };

            // Insert the newsFeedToInsert object to the database
            await newsFeedRepository.Create(newsFeedToInsert);
        }
    }
};

await channel2.BasicConsumeAsync(queue: "news",
    autoAck: true,
    consumer: consumer2);

await app.RunAsync();
