namespace Application.Masters.Driver;

internal static class DriverMappings
{
    public static DriverResponse ToResponse(this Domain.Masters.Driver entity) =>
        new(
            entity.DriverId,
            entity.Name,
            entity.Mobile,
            entity.TruckId,
            entity.Truck?.TruckNumber,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
