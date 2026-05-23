using Domain.Masters;

namespace Application.Masters;

internal static class NameBoardMappings
{
    public static NameBoardResponse ToResponse(this NameBoard entity) =>
        new(
            entity.NameBoardId,
            entity.Name,
            entity.Code,
            entity.OwnerName,
            entity.OwnerPhone,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
