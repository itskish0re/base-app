using Application.Common.Gridify;
using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class FinancialYearRepository(BillingDbContext context) : IFinancialYearRepository
{
    public async Task<FinancialYear?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.FinancialYears
            .FirstOrDefaultAsync(x => x.FinancialYearId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = code.Trim();
        return await context.FinancialYears.AnyAsync(
            x => !x.IsDeleted
                 && x.Code == normalized
                 && (excludeId == null || x.FinancialYearId != excludeId),
            cancellationToken);
    }

    public async Task<FinancialYearListResult> ListAsync(
        FinancialYearListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<FinancialYear> query = context.FinancialYears
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.FinancialYear);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "FinancialYearId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<FinancialYear> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new FinancialYearListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<FinancialYear>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.FinancialYears
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderByDescending(x => x.Code)
            .ThenBy(x => x.FinancialYearId)
            .ToListAsync(cancellationToken);

    public void Add(FinancialYear entity) => context.FinancialYears.Add(entity);
}
