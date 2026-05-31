namespace Application.Masters.GoodsItems;

public sealed record GoodsResponse(
    int GoodsId,
    string Code,
    string Name,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedGoodssResponse(
    IReadOnlyList<GoodsResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchGoodsItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateGoodssResponse(
    IReadOnlyList<GoodsResponse> Created,
    IReadOnlyList<BatchGoodsItemFailure> Failures);

public sealed record BatchUpdateGoodssResponse(
    IReadOnlyList<GoodsResponse> Updated,
    IReadOnlyList<BatchGoodsItemFailure> Failures);

public sealed record BatchDeleteGoodssResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchGoodsItemFailure> Failures);

public sealed record BatchToggleGoodssResponse(
    IReadOnlyList<GoodsResponse> Updated,
    IReadOnlyList<BatchGoodsItemFailure> Failures);

public sealed record CreateGoodsItem(string Code,
    string Name);

public sealed record UpdateGoodsItem(int GoodsId,
    string Code,
    string Name,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleGoodsItem(int GoodsId, bool IsEnabled);

public sealed record BatchCreateGoodssRequest(IReadOnlyList<CreateGoodsItemRequest> Items);

public sealed record CreateGoodsItemRequest(string Code,
    string Name);

public sealed record BatchUpdateGoodssRequest(IReadOnlyList<UpdateGoodsItemRequest> Items);

public sealed record UpdateGoodsItemRequest(int GoodsId,
    string Code,
    string Name,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteGoodssRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleGoodssRequest(IReadOnlyList<ToggleGoodsItemRequest> Items);

public sealed record ToggleGoodsItemRequest(int GoodsId, bool IsEnabled);

public sealed record LookupGoodssRequest(
    string Value,
    string Label,
    IReadOnlyList<GoodsLookupFieldMapping>? Fields);

public sealed record GoodsLookupFieldMapping(string KeyName, string ColumnName);

public sealed record GoodsLookupResponse(IReadOnlyList<GoodsLookupItem> Items);

public sealed record GoodsLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
