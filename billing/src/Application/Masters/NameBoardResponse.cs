namespace Application.Masters;

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
