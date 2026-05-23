namespace Application.Masters;

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
