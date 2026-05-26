using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class NameBoardRepository(BillingDbContext context) : INameBoardRepository
{
    public async Task<NameBoard?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.NameBoards
            .FirstOrDefaultAsync(x => x.NameBoardId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = code.Trim();
        return await context.NameBoards.AnyAsync(
            x => !x.IsDeleted
                 && x.Code == normalized
                 && (excludeId == null || x.NameBoardId != excludeId),
            cancellationToken);
    }

    public async Task<NameBoardListResult> ListAsync(
        NameBoardListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<NameBoard> query = context.NameBoards
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        var gridifyQuery = new GridifyQuery
        {
            Filter = criteria.Filter,
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy) ? "NameBoardId desc" : criteria.OrderBy,
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<NameBoard> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new NameBoardListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<NameBoard>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.NameBoards
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.NameBoardId)
            .ToListAsync(cancellationToken);

    public async Task<bool> HasActiveTrucksAsync(int nameBoardId, CancellationToken cancellationToken = default) =>
        await context.Trucks.AnyAsync(
            x => x.NameBoardId == nameBoardId && !x.IsDeleted,
            cancellationToken);

    public void Add(NameBoard nameBoard) => context.NameBoards.Add(nameBoard);
}
