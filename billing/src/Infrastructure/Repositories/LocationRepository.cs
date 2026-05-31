using Application.Common.Gridify;
using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class LocationRepository(BillingDbContext context) : ILocationRepository
{
    public async Task<Location?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Locations
            .FirstOrDefaultAsync(x => x.LocationId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = code.Trim();
        return await context.Locations.AnyAsync(
            x => !x.IsDeleted
                 && x.Code == normalized
                 && (excludeId == null || x.LocationId != excludeId),
            cancellationToken);
    }

    public async Task<LocationListResult> ListAsync(
        LocationListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Location> query = context.Locations
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.Location);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "LocationId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<Location> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new LocationListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Location>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.Locations
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.LocationId)
            .ToListAsync(cancellationToken);

    public void Add(Location entity) => context.Locations.Add(entity);
}
