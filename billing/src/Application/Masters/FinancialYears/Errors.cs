using SharedKernel;

namespace Application.Masters.FinancialYears;

internal static class FinancialYearErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "FinancialYear.NotFound",
        "Financial year was not found.");

    public static readonly Error CodeNotUnique = Error.Conflict(
        "FinancialYear.CodeNotUnique",
        "A financial year with this code already exists.");

    public static readonly Error InvalidYearCode = Error.Problem(
        "FinancialYear.InvalidYearCode",
        $"Code must be a year between {FinancialYearFormatting.MinYear} and {FinancialYearFormatting.MaxYear}.");
}
