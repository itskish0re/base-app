namespace Domain.Masters;

public interface IDriverRepository
{
    Task<Driver?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> TruckExistsAsync(int truckId, CancellationToken cancellationToken = default);

    Task<DriverListResult> ListAsync(DriverListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Driver>> ListForLookupAsync(CancellationToken cancellationToken = default);

    void Add(Driver driver);
}

public sealed record DriverListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record DriverListResult(IReadOnlyList<Driver> Items, int TotalCount);
