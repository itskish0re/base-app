using Application.Abstractions.Registry;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class AppEntityRegistryRepository(BillingDbContext context) : IAppEntityRegistryRepository
{
    public async Task<IReadOnlySet<string>> GetSelectableFieldNamesAsync(
        string entityName,
        string entityKind,
        CancellationToken cancellationToken = default)
    {
        List<string> fields = await context.AppEntityFields
            .AsNoTracking()
            .Where(f =>
                f.Selectable
                && f.Entity.EntityName == entityName
                && f.Entity.EntityKind == entityKind)
            .Select(f => f.FieldName)
            .ToListAsync(cancellationToken);

        return fields.ToHashSet(StringComparer.OrdinalIgnoreCase);
    }
}
