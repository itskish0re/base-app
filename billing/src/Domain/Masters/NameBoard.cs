using Domain.Platform;

namespace Domain.Masters;

public sealed class NameBoard : AuditableEntity
{
    public int NameBoardId { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string OwnerName { get; set; } = null!;

    public string? OwnerPhone { get; set; }

    public ICollection<Truck> Trucks { get; set; } = [];
}
