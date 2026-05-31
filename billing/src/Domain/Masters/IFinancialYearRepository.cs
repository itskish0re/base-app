namespace Domain.Masters;

public interface IFinancialYearRepository
{
    Task<FinancialYear?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(string code, int? excludeId, CancellationToken cancellationToken = default);

    Task<FinancialYearListResult> ListAsync(FinancialYearListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<FinancialYear>> ListForLookupAsync(CancellationToken cancellationToken = default);

    void Add(FinancialYear entity);
}

public sealed record FinancialYearListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record FinancialYearListResult(IReadOnlyList<FinancialYear> Items, int TotalCount);
