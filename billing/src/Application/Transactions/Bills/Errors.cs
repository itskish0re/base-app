using SharedKernel;

namespace Application.Transactions.Bills;

internal static class BillErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Bill.NotFound",
        "Bill was not found.");

    public static readonly Error BillNumberNotUnique = Error.Conflict(
        "Bill.BillNumberNotUnique",
        "A bill with this number already exists for the selected financial year.");
}
