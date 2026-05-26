using SharedKernel;

namespace Application.Masters.Driver;

internal static class DriverErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Driver.NotFound",
        "Driver was not found.");

    public static readonly Error TruckNotFound = Error.NotFound(
        "Driver.TruckNotFound",
        "Truck was not found.");
}
