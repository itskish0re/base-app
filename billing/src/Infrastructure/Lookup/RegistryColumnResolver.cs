using Application.Abstractions.Lookup;
using Application.Abstractions.Registry;
using Application.Common.Lookup;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Lookup;

internal sealed class RegistryColumnResolver(
    IAppEntityRegistryRepository registryRepository,
    IMemoryCache memoryCache) : IRegistryColumnResolver
{
    private static string CacheKey(string entityName) => $"registry-columns:transaction:{entityName}";

    public async Task<IReadOnlySet<string>> GetSelectableColumnsAsync(
        string entityName,
        CancellationToken cancellationToken = default)
    {
        string normalized = entityName.Trim();

        return await memoryCache.GetOrCreateAsync(CacheKey(normalized), async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return await registryRepository.GetSelectableFieldNamesAsync(
                normalized,
                EntityKinds.Transaction,
                cancellationToken);
        }) ?? new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    }

    public async Task<bool> IsValidColumnAsync(
        string entityName,
        string columnName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(columnName))
        {
            return false;
        }

        IReadOnlySet<string> columns = await GetSelectableColumnsAsync(entityName, cancellationToken);
        return columns.Contains(columnName.Trim());
    }

    public async Task<object?> ResolveAsync<TEntity>(
        string entityName,
        TEntity entity,
        string columnName,
        CancellationToken cancellationToken = default)
        where TEntity : class
    {
        if (!await IsValidColumnAsync(entityName, columnName, cancellationToken))
        {
            return null;
        }

        return EntityColumnResolver.Resolve(entity, columnName.Trim());
    }

    public void InvalidateCache(string? entityName = null)
    {
        if (string.IsNullOrWhiteSpace(entityName))
        {
            return;
        }

        memoryCache.Remove(CacheKey(entityName.Trim()));
    }
}
