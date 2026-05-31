using Application.Common.Gridify;
using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class GoodsRepository(BillingDbContext context) : IGoodsRepository
{
    public async Task<Goods?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Goods
            .FirstOrDefaultAsync(x => x.GoodsId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = code.Trim();
        return await context.Goods.AnyAsync(
            x => !x.IsDeleted
                 && x.Code == normalized
                 && (excludeId == null || x.GoodsId != excludeId),
            cancellationToken);
    }

    public async Task<GoodsListResult> ListAsync(
        GoodsListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Goods> query = context.Goods
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.Goods);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "GoodsId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<Goods> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new GoodsListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Goods>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.Goods
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.GoodsId)
            .ToListAsync(cancellationToken);

    public void Add(Goods entity) => context.Goods.Add(entity);
}
