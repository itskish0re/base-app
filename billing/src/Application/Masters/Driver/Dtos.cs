namespace Application.Masters.Driver;

public sealed record DriverResponse(
    int DriverId,
    string Name,
    string Mobile,
    int TruckId,
    string? TruckNumber,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedDriversResponse(
    IReadOnlyList<DriverResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchDriverItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateDriversResponse(
    IReadOnlyList<DriverResponse> Created,
    IReadOnlyList<BatchDriverItemFailure> Failures);

public sealed record BatchUpdateDriversResponse(
    IReadOnlyList<DriverResponse> Updated,
    IReadOnlyList<BatchDriverItemFailure> Failures);

public sealed record BatchDeleteDriversResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchDriverItemFailure> Failures);

public sealed record BatchToggleDriversResponse(
    IReadOnlyList<DriverResponse> Updated,
    IReadOnlyList<BatchDriverItemFailure> Failures);

public sealed record CreateDriverItem(string Name, string Mobile, int TruckId);

public sealed record UpdateDriverItem(
    int DriverId,
    string Name,
    string Mobile,
    int TruckId,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleDriverItem(int DriverId, bool IsEnabled);

public sealed record BatchCreateDriversRequest(IReadOnlyList<CreateDriverItemRequest> Items);

public sealed record CreateDriverItemRequest(string Name, string Mobile, int TruckId);

public sealed record BatchUpdateDriversRequest(IReadOnlyList<UpdateDriverItemRequest> Items);

public sealed record UpdateDriverItemRequest(
    int DriverId,
    string Name,
    string Mobile,
    int TruckId,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteDriversRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleDriversRequest(IReadOnlyList<ToggleDriverItemRequest> Items);

public sealed record ToggleDriverItemRequest(int DriverId, bool IsEnabled);

public sealed record LookupDriversRequest(
    string Value,
    string Label,
    IReadOnlyList<DriverLookupFieldMapping>? Fields);

public sealed record DriverLookupFieldMapping(string KeyName, string ColumnName);

public sealed record DriverLookupResponse(IReadOnlyList<DriverLookupItem> Items);

public sealed record DriverLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
