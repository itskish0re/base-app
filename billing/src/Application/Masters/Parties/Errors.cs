using SharedKernel;

namespace Application.Masters.Parties;

internal static class PartyErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Party.NotFound",
        "Party was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "Party.CodeNotUnique",
        "A party with this code already exists.");
}
