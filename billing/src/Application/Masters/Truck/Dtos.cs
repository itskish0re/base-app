namespace Application.Masters.Truck;

public sealed record TruckResponse(
    int TruckId,
    string TruckNumber,
    int NameBoardId,
    string? NameBoardCode,
    string? NameBoardName,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedTrucksResponse(
    IReadOnlyList<TruckResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchTruckItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateTrucksResponse(
    IReadOnlyList<TruckResponse> Created,
    IReadOnlyList<BatchTruckItemFailure> Failures);

public sealed record BatchUpdateTrucksResponse(
    IReadOnlyList<TruckResponse> Updated,
    IReadOnlyList<BatchTruckItemFailure> Failures);

public sealed record BatchDeleteTrucksResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchTruckItemFailure> Failures);

public sealed record BatchToggleTrucksResponse(
    IReadOnlyList<TruckResponse> Updated,
    IReadOnlyList<BatchTruckItemFailure> Failures);

public sealed record CreateTruckItem(string TruckNumber, int NameBoardId);

public sealed record UpdateTruckItem(
    int TruckId,
    string TruckNumber,
    int NameBoardId,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleTruckItem(int TruckId, bool IsEnabled);

public sealed record BatchCreateTrucksRequest(IReadOnlyList<CreateTruckItemRequest> Items);

public sealed record CreateTruckItemRequest(string TruckNumber, int NameBoardId);

public sealed record BatchUpdateTrucksRequest(IReadOnlyList<UpdateTruckItemRequest> Items);

public sealed record UpdateTruckItemRequest(
    int TruckId,
    string TruckNumber,
    int NameBoardId,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteTrucksRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleTrucksRequest(IReadOnlyList<ToggleTruckItemRequest> Items);

public sealed record ToggleTruckItemRequest(int TruckId, bool IsEnabled);

public sealed record LookupTrucksRequest(
    string Value,
    string Label,
    IReadOnlyList<TruckLookupFieldMapping>? Fields);

public sealed record TruckLookupFieldMapping(string KeyName, string ColumnName);

public sealed record TruckLookupResponse(IReadOnlyList<TruckLookupItem> Items);

public sealed record TruckLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
