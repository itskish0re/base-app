using Domain.Platform;

namespace Domain.Masters;

public sealed class Truck : AuditableEntity
{
    public int TruckId { get; set; }

    public string TruckNumber { get; set; } = null!;

    public int NameBoardId { get; set; }

    public NameBoard? NameBoard { get; set; }
}
