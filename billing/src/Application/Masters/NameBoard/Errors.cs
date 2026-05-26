using SharedKernel;

namespace Application.Masters.NameBoard;

internal static class NameBoardErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "NameBoard.NotFound",
        "Name board was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "NameBoard.CodeNotUnique",
        "A name board with this code already exists.");

    public static readonly Error HasTrucks = Error.Conflict(
        "NameBoard.HasTrucks",
        "Cannot delete a name board that has active trucks.");
}
