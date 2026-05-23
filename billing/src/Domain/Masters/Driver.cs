using Domain.Platform;

namespace Domain.Masters;

public sealed class Driver : AuditableEntity
{
    public int DriverId { get; set; }

    public string Name { get; set; } = null!;

    public string Mobile { get; set; } = null!;

    public int TruckId { get; set; }

    public Truck? Truck { get; set; }
}
