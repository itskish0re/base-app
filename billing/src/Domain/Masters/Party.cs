using Domain.Platform;

namespace Domain.Masters;

public sealed class Party : AuditableEntity
{
    public int PartyId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;
}
