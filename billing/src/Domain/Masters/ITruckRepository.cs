namespace Domain.Masters;

public interface ITruckRepository
{
    Task<Truck?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByTruckNumberAsync(string truckNumber, int? excludeId, CancellationToken cancellationToken = default);

    Task<bool> NameBoardExistsAsync(int nameBoardId, CancellationToken cancellationToken = default);

    Task<TruckListResult> ListAsync(TruckListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Truck>> ListForLookupAsync(CancellationToken cancellationToken = default);

    Task<bool> HasActiveDriversAsync(int truckId, CancellationToken cancellationToken = default);

    void Add(Truck truck);
}

public sealed record TruckListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record TruckListResult(IReadOnlyList<Truck> Items, int TotalCount);
