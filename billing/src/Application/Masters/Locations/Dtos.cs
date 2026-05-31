namespace Application.Masters.Locations;

public sealed record LocationResponse(
    int LocationId,
    string Code,
    string Name,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedLocationsResponse(
    IReadOnlyList<LocationResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchLocationItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateLocationsResponse(
    IReadOnlyList<LocationResponse> Created,
    IReadOnlyList<BatchLocationItemFailure> Failures);

public sealed record BatchUpdateLocationsResponse(
    IReadOnlyList<LocationResponse> Updated,
    IReadOnlyList<BatchLocationItemFailure> Failures);

public sealed record BatchDeleteLocationsResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchLocationItemFailure> Failures);

public sealed record BatchToggleLocationsResponse(
    IReadOnlyList<LocationResponse> Updated,
    IReadOnlyList<BatchLocationItemFailure> Failures);

public sealed record CreateLocationItem(string Code,
    string Name);

public sealed record UpdateLocationItem(int LocationId,
    string Code,
    string Name,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleLocationItem(int LocationId, bool IsEnabled);

public sealed record BatchCreateLocationsRequest(IReadOnlyList<CreateLocationItemRequest> Items);

public sealed record CreateLocationItemRequest(string Code,
    string Name);

public sealed record BatchUpdateLocationsRequest(IReadOnlyList<UpdateLocationItemRequest> Items);

public sealed record UpdateLocationItemRequest(int LocationId,
    string Code,
    string Name,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteLocationsRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleLocationsRequest(IReadOnlyList<ToggleLocationItemRequest> Items);

public sealed record ToggleLocationItemRequest(int LocationId, bool IsEnabled);

public sealed record LookupLocationsRequest(
    string Value,
    string Label,
    IReadOnlyList<LocationLookupFieldMapping>? Fields);

public sealed record LocationLookupFieldMapping(string KeyName, string ColumnName);

public sealed record LocationLookupResponse(IReadOnlyList<LocationLookupItem> Items);

public sealed record LocationLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
