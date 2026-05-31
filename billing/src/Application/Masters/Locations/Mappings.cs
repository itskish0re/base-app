namespace Application.Masters.Locations;

internal static class LocationMappings
{
    public static LocationResponse ToResponse(this Domain.Masters.Location entity) =>
        new(
            entity.LocationId,
            entity.Code,
            entity.Name,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
