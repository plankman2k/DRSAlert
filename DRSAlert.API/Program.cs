using Serilog;

var builder = WebApplication.CreateBuilder(args);

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

app.MapGet("/", () => "Hello World!");

await app.RunAsync();
