namespace Domain.Masters;

public interface ILocationRepository
{
    Task<Location?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(string code, int? excludeId, CancellationToken cancellationToken = default);

    Task<LocationListResult> ListAsync(LocationListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Location>> ListForLookupAsync(CancellationToken cancellationToken = default);

    void Add(Location entity);
}

public sealed record LocationListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record LocationListResult(IReadOnlyList<Location> Items, int TotalCount);
