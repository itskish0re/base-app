namespace Application.Masters;

public sealed record TruckResponse(
    int TruckId,
    string TruckNumber,
    int NameBoardId,
    string? NameBoardCode,
    bool IsEnabled,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);
