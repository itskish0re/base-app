namespace Domain.Masters;

public interface IPartyRepository
{
    Task<Party?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(string code, int? excludeId, CancellationToken cancellationToken = default);

    Task<PartyListResult> ListAsync(PartyListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Party>> ListForLookupAsync(CancellationToken cancellationToken = default);

    void Add(Party entity);
}

public sealed record PartyListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record PartyListResult(IReadOnlyList<Party> Items, int TotalCount);
