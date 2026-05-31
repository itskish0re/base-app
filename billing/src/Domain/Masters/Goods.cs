using Domain.Platform;

namespace Domain.Masters;

public sealed class Goods : AuditableEntity
{
    public int GoodsId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;
}
