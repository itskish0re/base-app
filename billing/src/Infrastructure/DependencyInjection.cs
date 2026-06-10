using System.Text;
using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Lookup;
using Application.Abstractions.Registry;
using SharedKernel;
using Domain.Access;
using Domain.Auth;
using Domain.Masters;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Persistence;
using Infrastructure.Lookup;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Dapper;
using Infrastructure.Time;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
        services.AddScoped<Application.Abstractions.Context.IFinancialYearContext, Infrastructure.Context.FinancialYearContext>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<EndpointAccessCache>();

        services.AddMemoryCache();

        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
        }

        services.AddSingleton(_ => NpgsqlDataSourceFactory.Create(connectionString));
        services.AddScoped<IDbConnectionFactory, DbConnectionFactory>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IEndpointAccessRepository, EndpointAccessRepository>();
        services.AddScoped<INameBoardRepository, NameBoardRepository>();
        services.AddScoped<ITruckRepository, TruckRepository>();
        services.AddScoped<ILocationRepository, LocationRepository>();
        services.AddScoped<IPartyRepository, PartyRepository>();
        services.AddScoped<IGoodsRepository, GoodsRepository>();
        services.AddScoped<IUnitRepository, UnitRepository>();
        services.AddScoped<IFinancialYearRepository, FinancialYearRepository>();
        services.AddScoped<Domain.Transactions.IBillRepository, BillRepository>();
        services.AddScoped<Domain.Transactions.ILoadRepository, LoadRepository>();
        services.AddSingleton<IViewSchemaValidator, ViewSchemaValidator>();
        services.AddScoped<IAppEntityRegistryRepository, AppEntityRegistryRepository>();
        services.AddScoped<IAppEntityScreenRepository, AppEntityScreenRepository>();
        services.AddScoped<IRegistryColumnResolver, RegistryColumnResolver>();

        services.AddDbContext<BillingDbContext>((serviceProvider, options) =>
            options
                .UseNpgsql(serviceProvider.GetRequiredService<NpgsqlDataSource>())
                .UseSnakeCaseNamingConvention());

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<BillingDbContext>());

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Keep JWT claim names as issued (role_id, sub, etc.) for UserContext lookup.
                options.MapInboundClaims = false;
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
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                    RoleClaimType = ClaimTypes.Role,
                };
            });

        services.AddAuthorization();

        services.AddHealthChecks()
            .AddNpgSql(connectionString);

        return services;
    }
}
