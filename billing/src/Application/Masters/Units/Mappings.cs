namespace Application.Masters.Units;

internal static class UnitMappings
{
    public static UnitResponse ToResponse(this Domain.Masters.Unit entity) =>
        new(
            entity.UnitId,
            entity.Code,
            entity.Name,
            entity.IsFixed,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
