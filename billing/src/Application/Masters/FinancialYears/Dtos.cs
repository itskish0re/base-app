namespace Application.Masters.FinancialYears;

public sealed record FinancialYearResponse(
    int FinancialYearId,
    string Code,
    string Name,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedFinancialYearsResponse(
    IReadOnlyList<FinancialYearResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchFinancialYearItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateFinancialYearsResponse(
    IReadOnlyList<FinancialYearResponse> Created,
    IReadOnlyList<BatchFinancialYearItemFailure> Failures);

public sealed record BatchUpdateFinancialYearsResponse(
    IReadOnlyList<FinancialYearResponse> Updated,
    IReadOnlyList<BatchFinancialYearItemFailure> Failures);

public sealed record BatchDeleteFinancialYearsResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchFinancialYearItemFailure> Failures);

public sealed record BatchToggleFinancialYearsResponse(
    IReadOnlyList<FinancialYearResponse> Updated,
    IReadOnlyList<BatchFinancialYearItemFailure> Failures);

public sealed record CreateFinancialYearItem(string Code);

public sealed record UpdateFinancialYearItem(
    int FinancialYearId,
    string Code,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record ToggleFinancialYearItem(int FinancialYearId, bool IsEnabled);

public sealed record BatchCreateFinancialYearsRequest(IReadOnlyList<CreateFinancialYearItemRequest> Items);

public sealed record CreateFinancialYearItemRequest(string Code);

public sealed record BatchUpdateFinancialYearsRequest(IReadOnlyList<UpdateFinancialYearItemRequest> Items);

public sealed record UpdateFinancialYearItemRequest(
    int FinancialYearId,
    string Code,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeleteFinancialYearsRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleFinancialYearsRequest(IReadOnlyList<ToggleFinancialYearItemRequest> Items);

public sealed record ToggleFinancialYearItemRequest(int FinancialYearId, bool IsEnabled);

public sealed record LookupFinancialYearsRequest(
    string Value,
    string Label,
    IReadOnlyList<FinancialYearLookupFieldMapping>? Fields);

public sealed record FinancialYearLookupFieldMapping(string KeyName, string ColumnName);

public sealed record FinancialYearLookupResponse(IReadOnlyList<FinancialYearLookupItem> Items);

public sealed record FinancialYearLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
