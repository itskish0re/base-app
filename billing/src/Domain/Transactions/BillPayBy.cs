namespace Domain.Transactions;

public static class BillPayBy
{
    public const string Upi = "upi";
    public const string Cash = "cash";
    public const string Owner = "owner";

    private static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase)
    {
        Upi,
        Cash,
        Owner,
    };

    public static bool IsAllowed(string? value) =>
        value is not null && Allowed.Contains(value);
}
