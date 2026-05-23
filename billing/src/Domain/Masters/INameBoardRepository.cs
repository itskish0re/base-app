namespace Domain.Masters;

public interface INameBoardRepository
{
    Task<NameBoard?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(string code, int? excludeId, CancellationToken cancellationToken = default);

    Task<NameBoardListResult> ListAsync(NameBoardListCriteria criteria, CancellationToken cancellationToken = default);

    void Add(NameBoard nameBoard);
}

public sealed record NameBoardListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record NameBoardListResult(IReadOnlyList<NameBoard> Items, int TotalCount);
