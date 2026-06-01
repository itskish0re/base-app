using Application.Common.Gridify;
using Domain.Transactions;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class BillRepository(BillingDbContext context) : IBillRepository
{
    public Task<Bill?> GetByIdAsync(int billId, bool includeLoads, CancellationToken cancellationToken = default)
    {
        IQueryable<Bill> query = context.Bills.AsNoTracking().Where(x => !x.IsDeleted);

        if (includeLoads)
        {
            query = query
                .Include(x => x.Loads.Where(l => l.IsActive && !l.IsDeleted))
                .AsSplitQuery();
        }

        return query.FirstOrDefaultAsync(x => x.BillId == billId, cancellationToken);
    }

    public Task<Bill?> GetByIdForUpdateAsync(int billId, CancellationToken cancellationToken = default) =>
        context.Bills
            .FirstOrDefaultAsync(x => x.BillId == billId && !x.IsDeleted, cancellationToken);

    public Task<bool> ExistsByBillNumberAsync(
        int financialYearId,
        string billNumber,
        int? excludeBillId,
        CancellationToken cancellationToken = default)
    {
        string normalized = billNumber.Trim();
        return context.Bills.AnyAsync(
            x => !x.IsDeleted
                 && x.FinancialYearId == financialYearId
                 && x.BillNumber == normalized
                 && (excludeBillId == null || x.BillId != excludeBillId),
            cancellationToken);
    }

    public async Task<string?> GetLastBillNumberAsync(int financialYearId, CancellationToken cancellationToken = default)
    {
        return await context.Bills
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.FinancialYearId == financialYearId)
            .OrderByDescending(x => x.BillId)
            .Select(x => x.BillNumber)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<BillListResult> ListAsync(BillListCriteria criteria, CancellationToken cancellationToken = default)
    {
        IQueryable<BillListRow> query = context.BillListRows
            .AsNoTracking()
            .Where(x => x.FinancialYearId == criteria.FinancialYearId);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, TransactionGridifyMappers.Bill);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "BillId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<BillListRow> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new BillListResult(paging.Data.ToList(), paging.Count);
    }

    public void Add(Bill bill) => context.Bills.Add(bill);
}
