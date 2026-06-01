namespace Domain.Transactions;

public interface ILoadRepository
{
    Task<LoadListResult> ListAsync(LoadListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Load>> GetActiveByBillIdAsync(int billId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Load>> GetAllByBillIdForUpdateAsync(int billId, CancellationToken cancellationToken = default);

    void Add(Load load);
}

public sealed record LoadListCriteria(
    int FinancialYearId,
    string? Filter,
    string? OrderBy,
    int Page,
    int PageSize);

public sealed record LoadListResult(IReadOnlyList<LoadListRow> Items, int TotalCount);
