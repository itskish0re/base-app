using Domain.Platform;

namespace Domain.Masters;

public sealed class Location : AuditableEntity
{
    public int LocationId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;
}
