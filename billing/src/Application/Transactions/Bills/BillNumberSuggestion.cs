namespace Application.Transactions.Bills;

internal static class BillNumberSuggestion
{
    public static string SuggestNext(string? lastBillNumber)
    {
        if (string.IsNullOrWhiteSpace(lastBillNumber))
        {
            return "1";
        }

        string trimmed = lastBillNumber.Trim();
        if (long.TryParse(trimmed, out long numeric))
        {
            return (numeric + 1).ToString();
        }

        int suffixStart = trimmed.Length;
        while (suffixStart > 0 && char.IsDigit(trimmed[suffixStart - 1]))
        {
            suffixStart--;
        }

        if (suffixStart < trimmed.Length
            && long.TryParse(trimmed[suffixStart..], out long trailing))
        {
            return trimmed[..suffixStart] + (trailing + 1);
        }

        return trimmed + "1";
    }
}
