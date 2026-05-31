namespace Domain.Masters;

public interface IUnitRepository
{
    Task<Unit?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(string code, int? excludeId, CancellationToken cancellationToken = default);

    Task<UnitListResult> ListAsync(UnitListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Unit>> ListForLookupAsync(CancellationToken cancellationToken = default);

    void Add(Unit entity);
}

public sealed record UnitListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record UnitListResult(IReadOnlyList<Unit> Items, int TotalCount);
