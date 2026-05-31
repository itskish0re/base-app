namespace Application.Masters.Units;

public sealed record UnitResponse(
    int UnitId,
    string Code,
    string Name,
    bool IsFixed,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedUnitsResponse(
    IReadOnlyList<UnitResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchUnitItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateUnitsResponse(
    IReadOnlyList<UnitResponse> Created,
    IReadOnlyList<BatchUnitItemFailure> Failures);

public sealed record BatchUpdateUnitsResponse(
    IReadOnlyList<UnitResponse> Updated,
    IReadOnlyList<BatchUnitItemFailure> Failures);

public sealed record BatchDeleteUnitsResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchUnitItemFailure> Failures);

public sealed record BatchToggleUnitsResponse(
    IReadOnlyList<UnitResponse> Updated,
    IReadOnlyList<BatchUnitItemFailure> Failures);

public sealed record CreateUnitItem(string Code,
    string Name,
    bool IsFixed);

public sealed record UpdateUnitItem(int UnitId,
    string Code,
    string Name,
    bool IsFixed,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleUnitItem(int UnitId, bool IsEnabled);

public sealed record BatchCreateUnitsRequest(IReadOnlyList<CreateUnitItemRequest> Items);

public sealed record CreateUnitItemRequest(string Code,
    string Name,
    bool IsFixed);

public sealed record BatchUpdateUnitsRequest(IReadOnlyList<UpdateUnitItemRequest> Items);

public sealed record UpdateUnitItemRequest(int UnitId,
    string Code,
    string Name,
    bool IsFixed,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteUnitsRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleUnitsRequest(IReadOnlyList<ToggleUnitItemRequest> Items);

public sealed record ToggleUnitItemRequest(int UnitId, bool IsEnabled);

public sealed record LookupUnitsRequest(
    string Value,
    string Label,
    IReadOnlyList<UnitLookupFieldMapping>? Fields);

public sealed record UnitLookupFieldMapping(string KeyName, string ColumnName);

public sealed record UnitLookupResponse(IReadOnlyList<UnitLookupItem> Items);

public sealed record UnitLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
