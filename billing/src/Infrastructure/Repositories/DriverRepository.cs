using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class DriverRepository(BillingDbContext context) : IDriverRepository
{
    public async Task<Driver?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Drivers
            .Include(x => x.Truck)
            .FirstOrDefaultAsync(x => x.DriverId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> TruckExistsAsync(int truckId, CancellationToken cancellationToken = default) =>
        await context.Trucks.AnyAsync(
            x => x.TruckId == truckId && !x.IsDeleted,
            cancellationToken);

    public async Task<DriverListResult> ListAsync(
        DriverListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Driver> query = context.Drivers
            .AsNoTracking()
            .Include(x => x.Truck)
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.Driver);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy) ? "DriverId desc" : criteria.OrderBy,
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<Driver> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new DriverListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Driver>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.Drivers
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.DriverId)
            .ToListAsync(cancellationToken);

    public void Add(Driver driver) => context.Drivers.Add(driver);
}
