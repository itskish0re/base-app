namespace Domain.Transactions;

public interface IBillRepository
{
    Task<Bill?> GetByIdAsync(int billId, bool includeLoads, CancellationToken cancellationToken = default);

    Task<Bill?> GetByIdForUpdateAsync(int billId, CancellationToken cancellationToken = default);

    Task<bool> ExistsByBillNumberAsync(
        int financialYearId,
        string billNumber,
        int? excludeBillId,
        CancellationToken cancellationToken = default);

    Task<string?> GetLastBillNumberAsync(int financialYearId, CancellationToken cancellationToken = default);

    Task<BillListResult> ListAsync(BillListCriteria criteria, CancellationToken cancellationToken = default);

    void Add(Bill bill);
}

public sealed record BillListCriteria(
    int FinancialYearId,
    string? Filter,
    string? OrderBy,
    int Page,
    int PageSize);

public sealed record BillListResult(IReadOnlyList<BillListRow> Items, int TotalCount);
