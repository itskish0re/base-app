namespace Application.Masters.NameBoard;

public sealed record NameBoardResponse(
    int NameBoardId,
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchNameBoardItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Created,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record BatchUpdateNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Updated,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record BatchDeleteNameBoardsResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record BatchToggleNameBoardsResponse(
    IReadOnlyList<NameBoardResponse> Updated,
    IReadOnlyList<BatchNameBoardItemFailure> Failures);

public sealed record CreateNameBoardItem(
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone);

public sealed record UpdateNameBoardItem(
    int NameBoardId,
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleNameBoardItem(int NameBoardId, bool IsEnabled);

public sealed record BatchCreateNameBoardsRequest(IReadOnlyList<CreateNameBoardItemRequest> Items);

public sealed record CreateNameBoardItemRequest(
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone);

public sealed record BatchUpdateNameBoardsRequest(IReadOnlyList<UpdateNameBoardItemRequest> Items);

public sealed record UpdateNameBoardItemRequest(
    int NameBoardId,
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteNameBoardsRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleNameBoardsRequest(IReadOnlyList<ToggleNameBoardItemRequest> Items);

public sealed record ToggleNameBoardItemRequest(int NameBoardId, bool IsEnabled);

public sealed record LookupNameBoardsRequest(
    string Value,
    string Label,
    IReadOnlyList<NameBoardLookupFieldMapping>? Fields);

public sealed record NameBoardLookupFieldMapping(string KeyName, string ColumnName);

public sealed record NameBoardLookupResponse(IReadOnlyList<NameBoardLookupItem> Items);

public sealed record NameBoardLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
