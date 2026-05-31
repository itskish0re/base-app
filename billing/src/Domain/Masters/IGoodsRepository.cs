namespace Domain.Masters;

public interface IGoodsRepository
{
    Task<Goods?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> ExistsByCodeAsync(string code, int? excludeId, CancellationToken cancellationToken = default);

    Task<GoodsListResult> ListAsync(GoodsListCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Goods>> ListForLookupAsync(CancellationToken cancellationToken = default);

    void Add(Goods entity);
}

public sealed record GoodsListCriteria(string? Filter, string? OrderBy, int Page, int PageSize);

public sealed record GoodsListResult(IReadOnlyList<Goods> Items, int TotalCount);
