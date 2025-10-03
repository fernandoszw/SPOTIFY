using CRUD_MProjetoSpotifyusica.Services;
using Microsoft.EntityFrameworkCore;
using ProjetoSpotify.Context;
using ProjetoSpotify.Repositories;
using ProjetoSpotify.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<SpotifyContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConexaoPadrao"))
);

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Permite qualquer origem (pode ser restrito a um domínio específico)
              .AllowAnyMethod()   // Permite qualquer método HTTP (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader();  // Permite qualquer cabeçalho
    });
});

builder.Services.AddScoped<IMusicaRepository, MusicaRepository>();
builder.Services.AddScoped<IMusicaService, MusicaService>();

// Swagger tradicional
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
