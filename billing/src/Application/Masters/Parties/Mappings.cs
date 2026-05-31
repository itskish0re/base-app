namespace Application.Masters.Parties;

internal static class PartyMappings
{
    public static PartyResponse ToResponse(this Domain.Masters.Party entity) =>
        new(
            entity.PartyId,
            entity.Code,
            entity.Name,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
