using Application.Common.Gridify;
using Domain.Transactions;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class LoadRepository(BillingDbContext context) : ILoadRepository
{
    public async Task<LoadListResult> ListAsync(LoadListCriteria criteria, CancellationToken cancellationToken = default)
    {
        IQueryable<LoadListRow> query = context.LoadListRows
            .AsNoTracking()
            .Where(x => x.FinancialYearId == criteria.FinancialYearId && x.IsActive);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, TransactionGridifyMappers.Load);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "LoadId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<LoadListRow> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new LoadListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Load>> GetActiveByBillIdAsync(int billId, CancellationToken cancellationToken = default) =>
        await context.Loads
            .AsNoTracking()
            .Where(x => x.BillId == billId && x.IsActive && !x.IsDeleted)
            .OrderBy(x => x.LoadNumber)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Load>> GetAllByBillIdForUpdateAsync(int billId, CancellationToken cancellationToken = default) =>
        await context.Loads
            .Where(x => x.BillId == billId && !x.IsDeleted)
            .ToListAsync(cancellationToken);

    public void Add(Load load) => context.Loads.Add(load);
}
