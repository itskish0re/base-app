namespace Application.Masters.Parties;

public sealed record PartyResponse(
    int PartyId,
    string Code,
    string Name,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedPartysResponse(
    IReadOnlyList<PartyResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchPartyItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreatePartysResponse(
    IReadOnlyList<PartyResponse> Created,
    IReadOnlyList<BatchPartyItemFailure> Failures);

public sealed record BatchUpdatePartysResponse(
    IReadOnlyList<PartyResponse> Updated,
    IReadOnlyList<BatchPartyItemFailure> Failures);

public sealed record BatchDeletePartysResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchPartyItemFailure> Failures);

public sealed record BatchTogglePartysResponse(
    IReadOnlyList<PartyResponse> Updated,
    IReadOnlyList<BatchPartyItemFailure> Failures);

public sealed record CreatePartyItem(string Code,
    string Name);

public sealed record UpdatePartyItem(int PartyId,
    string Code,
    string Name,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record TogglePartyItem(int PartyId, bool IsEnabled);

public sealed record BatchCreatePartysRequest(IReadOnlyList<CreatePartyItemRequest> Items);

public sealed record CreatePartyItemRequest(string Code,
    string Name);

public sealed record BatchUpdatePartysRequest(IReadOnlyList<UpdatePartyItemRequest> Items);

public sealed record UpdatePartyItemRequest(int PartyId,
    string Code,
    string Name,
    bool IsEnabled = true,
    bool IsActive = true);

public sealed record BatchDeletePartysRequest(IReadOnlyList<int> Ids);

public sealed record BatchTogglePartysRequest(IReadOnlyList<TogglePartyItemRequest> Items);

public sealed record TogglePartyItemRequest(int PartyId, bool IsEnabled);

public sealed record LookupPartysRequest(
    string Value,
    string Label,
    IReadOnlyList<PartyLookupFieldMapping>? Fields);

public sealed record PartyLookupFieldMapping(string KeyName, string ColumnName);

public sealed record PartyLookupResponse(IReadOnlyList<PartyLookupItem> Items);

public sealed record PartyLookupItem(
    object Value,
    object? Label,
    IReadOnlyDictionary<string, object?> Fields);
