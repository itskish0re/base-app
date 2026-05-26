namespace Application.Abstractions.Lookup;

/// <summary>
/// Validates lookup column names against <c>app_entity_field</c> for <c>transaction</c> entities.
/// Use <c>EntityColumnResolver</c> (reflection) for master entities such as name boards.
/// </summary>
public interface IRegistryColumnResolver
{
    Task<IReadOnlySet<string>> GetSelectableColumnsAsync(
        string entityName,
        CancellationToken cancellationToken = default);

    Task<bool> IsValidColumnAsync(
        string entityName,
        string columnName,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates <paramref name="columnName"/> against the registry, then reads the value from <paramref name="entity"/>.
    /// </summary>
    Task<object?> ResolveAsync<TEntity>(
        string entityName,
        TEntity entity,
        string columnName,
        CancellationToken cancellationToken = default)
        where TEntity : class;

    void InvalidateCache(string? entityName = null);
}
