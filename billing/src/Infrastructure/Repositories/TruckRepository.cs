using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class TruckRepository(BillingDbContext context) : ITruckRepository
{
    public async Task<Truck?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Trucks
            .Include(x => x.NameBoard)
            .FirstOrDefaultAsync(x => x.TruckId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByTruckNumberAsync(
        string truckNumber,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = truckNumber.Trim();
        return await context.Trucks.AnyAsync(
            x => !x.IsDeleted
                 && x.TruckNumber == normalized
                 && (excludeId == null || x.TruckId != excludeId),
            cancellationToken);
    }

    public async Task<bool> NameBoardExistsAsync(int nameBoardId, CancellationToken cancellationToken = default) =>
        await context.NameBoards.AnyAsync(
            x => x.NameBoardId == nameBoardId && !x.IsDeleted,
            cancellationToken);

    public async Task<TruckListResult> ListAsync(
        TruckListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Truck> query = context.Trucks
            .AsNoTracking()
            .Include(x => x.NameBoard)
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.Truck);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy) ? "TruckId desc" : criteria.OrderBy,
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<Truck> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new TruckListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Truck>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.Trucks
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.TruckNumber)
            .ThenBy(x => x.TruckId)
            .ToListAsync(cancellationToken);

    public async Task<bool> HasActiveDriversAsync(int truckId, CancellationToken cancellationToken = default) =>
        await context.Drivers.AnyAsync(
            x => x.TruckId == truckId && !x.IsDeleted,
            cancellationToken);

    public void Add(Truck truck) => context.Trucks.Add(truck);
}
