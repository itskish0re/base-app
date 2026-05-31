using SharedKernel;

namespace Application.Masters.Truck;

internal static class TruckErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Truck.NotFound",
        "Truck was not found.");

    public static readonly Error TruckNumberNotUnique = Error.Conflict(
        "Truck.TruckNumberNotUnique",
        "A truck with this truck number already exists.");

    public static readonly Error NameBoardNotFound = Error.NotFound(
        "Truck.NameBoardNotFound",
        "Name board was not found.");
}
