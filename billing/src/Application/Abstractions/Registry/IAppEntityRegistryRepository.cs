namespace Application.Abstractions.Registry;

public interface IAppEntityRegistryRepository
{
    /// <summary>
    /// Returns <c>field_name</c> values from <c>app_entity_field</c> where the entity matches
    /// <paramref name="entityName"/> and <paramref name="entityKind"/>, and <c>selectable</c> is true.
    /// </summary>
    Task<IReadOnlySet<string>> GetSelectableFieldNamesAsync(
        string entityName,
        string entityKind,
        CancellationToken cancellationToken = default);
}
