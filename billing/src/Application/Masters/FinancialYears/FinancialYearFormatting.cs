namespace Application.Masters.FinancialYears;

internal static class FinancialYearFormatting
{
    public const int MinYear = 1900;
    public const int MaxYear = 2100;

    public static bool TryParseYearCode(string code, out int year)
    {
        year = 0;

        if (string.IsNullOrWhiteSpace(code))
        {
            return false;
        }

        if (!int.TryParse(code.Trim(), out year))
        {
            return false;
        }

        return year is >= MinYear and <= MaxYear;
    }

    public static string FormatNameFromCode(string code)
    {
        if (!TryParseYearCode(code, out int year))
        {
            throw new ArgumentException("Code must be a valid four-digit year.", nameof(code));
        }

        return $"FY {year}-{year + 1}";
    }
}
