namespace Application.Masters.Truck;

internal static class TruckMappings
{
    public static TruckResponse ToResponse(this Domain.Masters.Truck entity) =>
        new(
            entity.TruckId,
            entity.TruckNumber,
            entity.NameBoardId,
            entity.NameBoard?.Code,
            entity.NameBoard?.Name,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
