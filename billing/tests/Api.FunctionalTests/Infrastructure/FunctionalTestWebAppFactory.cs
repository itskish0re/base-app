using Application.Abstractions.Data;
using Infrastructure.Data;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Npgsql;
using Testcontainers.PostgreSql;

namespace Api.FunctionalTests.Infrastructure;

public class FunctionalTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:latest")
        .WithDatabase("billing")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IDbConnectionFactory>();
            services.RemoveAll<NpgsqlDataSource>();
            var dataSource = NpgsqlDataSourceFactory.Create(_dbContainer.GetConnectionString());
            services.AddSingleton(dataSource);
            services.AddSingleton<IDbConnectionFactory>(_ => new DbConnectionFactory(dataSource));

            services.RemoveAll<DbContextOptions<BillingDbContext>>();
            services.AddDbContext<BillingDbContext>((serviceProvider, options) =>
                options
                    .UseNpgsql(serviceProvider.GetRequiredService<NpgsqlDataSource>())
                    .UseSnakeCaseNamingConvention());
        });
    }

    public async Task InitializeAsync() => await _dbContainer.StartAsync();

    public new async Task DisposeAsync() => await _dbContainer.StopAsync();
}
