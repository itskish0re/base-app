using System.Text;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using SharedKernel;
using Domain.Access;
using Domain.Auth;
using Domain.Masters;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Dapper;
using Infrastructure.Time;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddHttpContextAccessor();
        services.AddScoped<IUserContext, UserContext>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<EndpointAccessCache>();

        services.AddMemoryCache();

        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
        }

        services.AddSingleton(_ => new NpgsqlDataSourceBuilder(connectionString).Build());
        services.AddScoped<IDbConnectionFactory, DbConnectionFactory>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IEndpointAccessRepository, EndpointAccessRepository>();
        services.AddScoped<INameBoardRepository, NameBoardRepository>();

        services.AddDbContext<BillingDbContext>(options =>
            options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<BillingDbContext>());

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration[$"{JwtSettings.SectionName}:Issuer"],
                    ValidAudience = configuration[$"{JwtSettings.SectionName}:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration[$"{JwtSettings.SectionName}:SigningKey"]!)),
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role,
                };
            });

        services.AddAuthorization();

        services.AddHealthChecks()
            .AddNpgSql(connectionString);

        return services;
    }
}
