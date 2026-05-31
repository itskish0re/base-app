using SharedKernel;

namespace Application.Masters.Units;

internal static class UnitErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Unit.NotFound",
        "Unit was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "Unit.CodeNotUnique",
        "A unit with this code already exists.");
}
