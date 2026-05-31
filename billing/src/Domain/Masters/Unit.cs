using Domain.Platform;

namespace Domain.Masters;

public sealed class Unit : AuditableEntity
{
    public int UnitId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public bool IsFixed { get; set; }
}
