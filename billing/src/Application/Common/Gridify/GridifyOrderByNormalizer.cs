namespace Application.Common.Gridify;

public static class GridifyOrderByNormalizer
{
    public static string? Normalize(string? orderBy)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
        {
            return orderBy;
        }

        string[] segments = orderBy.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        return string.Join(", ", segments.Select(NormalizeSegment));
    }

    private static string NormalizeSegment(string segment)
    {
        string[] parts = segment.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
        {
            return segment;
        }

        parts[0] = FieldNameConverter.ToPascalCase(parts[0]);
        return string.Join(" ", parts);
    }
}
