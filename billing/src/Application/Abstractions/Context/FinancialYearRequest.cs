using SharedKernel;

namespace Application.Abstractions.Context;

public static class FinancialYearRequest
{
    public static readonly Error Missing = new(
        "FinancialYear.Missing",
        "Financial year is required. Select a financial year in the app header.",
        ErrorType.Validation);

    public static Result<int> Require(IFinancialYearContext context)
    {
        if (context.FinancialYearId is not int financialYearId || financialYearId <= 0)
        {
            return Result.Failure<int>(Missing);
        }

        return financialYearId;
    }
}
