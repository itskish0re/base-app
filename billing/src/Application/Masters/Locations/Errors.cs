using SharedKernel;

namespace Application.Masters.Locations;

internal static class LocationErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Location.NotFound",
        "Location was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "Location.CodeNotUnique",
        "A location with this code already exists.");
}
