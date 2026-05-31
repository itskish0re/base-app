using Application.Common.Gridify;
using Domain.Masters;
using Gridify;
using Gridify.EntityFramework;
using Infrastructure.Gridify;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class PartyRepository(BillingDbContext context) : IPartyRepository
{
    public async Task<Party?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await context.Parties
            .FirstOrDefaultAsync(x => x.PartyId == id && !x.IsDeleted, cancellationToken);

    public async Task<bool> ExistsByCodeAsync(
        string code,
        int? excludeId,
        CancellationToken cancellationToken = default)
    {
        string normalized = code.Trim();
        return await context.Parties.AnyAsync(
            x => !x.IsDeleted
                 && x.Code == normalized
                 && (excludeId == null || x.PartyId != excludeId),
            cancellationToken);
    }

    public async Task<PartyListResult> ListAsync(
        PartyListCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Party> query = context.Parties
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        string? filter = GridifyListFilter.Normalize(criteria.Filter);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.ApplyFiltering(filter, MasterGridifyMappers.Party);
        }

        var gridifyQuery = new GridifyQuery
        {
            OrderBy = string.IsNullOrWhiteSpace(criteria.OrderBy)
                ? "PartyId desc"
                : GridifyOrderByNormalizer.Normalize(criteria.OrderBy),
            Page = criteria.Page,
            PageSize = criteria.PageSize,
        };

        Paging<Party> paging = await query.GridifyAsync(gridifyQuery, cancellationToken);

        return new PartyListResult(paging.Data.ToList(), paging.Count);
    }

    public async Task<IReadOnlyList<Party>> ListForLookupAsync(CancellationToken cancellationToken = default) =>
        await context.Parties
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.IsEnabled && x.IsActive)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.PartyId)
            .ToListAsync(cancellationToken);

    public void Add(Party entity) => context.Parties.Add(entity);
}
