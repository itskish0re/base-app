namespace Application.Masters.GoodsItems;

internal static class GoodsMappings
{
    public static GoodsResponse ToResponse(this Domain.Masters.Goods entity) =>
        new(
            entity.GoodsId,
            entity.Code,
            entity.Name,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
