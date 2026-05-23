using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Extensions;

internal static class MigrationExtensions
{
    public static void ApplyMigrations(this WebApplication app)
    {
        using IServiceScope scope = app.Services.CreateScope();
        BillingDbContext db = scope.ServiceProvider.GetRequiredService<BillingDbContext>();
        db.Database.Migrate();
    }
}
