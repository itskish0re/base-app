namespace Infrastructure.Gridify;

/// <summary>
/// Normalizes list <c>filter</c> query values for Gridify.
/// Plain text (e.g. <c>smr</c>) is converted to a composite <c>search</c> contains filter.
/// </summary>
internal static class GridifyListFilter
{
    public const string GlobalSearchField = "search";

    public static string? Normalize(string? filter)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return null;
        }

        string trimmed = filter.Trim();
        if (LooksLikeGridifyExpression(trimmed))
        {
            return trimmed;
        }

        return $"{GlobalSearchField}=*{EscapeFilterValue(trimmed)}";
    }

    private static bool LooksLikeGridifyExpression(string filter) =>
        filter.Contains('=') || filter.Contains('|') || filter.Contains('(');

    private static string EscapeFilterValue(string value) =>
        value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace(",", "\\,", StringComparison.Ordinal)
            .Replace("|", "\\|", StringComparison.Ordinal);
}
