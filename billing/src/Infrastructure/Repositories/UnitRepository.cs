using Application.Common.Gridify;
using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class UnitRepository(BillingDbContext context) : IUnitRepository
{
    public async Task<Unit?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Units
            .FirstOrDefaultAsync(x => x.UnitId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = code.Trim();
        return await context.Units.AnyAsync(
            x => !x.IsDeleted
                 && x.Code == normalized
                 && (excludeId == null || x.UnitId != excludeId),
            cancellationToken);
    }

    public async Task<UnitListResult> ListAsync(
        UnitListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Unit> query = context.Units
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.Unit);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "UnitId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<Unit> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new UnitListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Unit>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.Units
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.UnitId)
            .ToListAsync(cancellationToken);

    public void Add(Unit entity) => context.Units.Add(entity);
}
