using SharedKernel;

namespace Application.Masters;

internal static class NameBoardErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "NameBoard.NotFound",
        "Name board was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "NameBoard.CodeNotUnique",
        "A name board with this code already exists.");
}
