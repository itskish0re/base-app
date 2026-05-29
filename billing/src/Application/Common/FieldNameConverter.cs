namespace Application.Common;

/// <summary>
/// Maps registry / database field names (snake_case) to client property names (camelCase).
/// </summary>
public static class FieldNameConverter
{
    public static string ToCamelCase(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return name;
        }

        if (!name.Contains('_'))
        {
            return name;
        }

        string[] parts = name.Split('_', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
        {
            return name;
        }

        var buffer = new System.Text.StringBuilder(name.Length);
        buffer.Append(parts[0].ToLowerInvariant());

        for (int i = 1; i < parts.Length; i++)
        {
            if (parts[i].Length == 0)
            {
                continue;
            }

            buffer.Append(char.ToUpperInvariant(parts[i][0]));
            if (parts[i].Length > 1)
            {
                buffer.Append(parts[i][1..].ToLowerInvariant());
            }
        }

        return buffer.ToString();
    }

    /// <summary>Gridify order-by uses C# property names (PascalCase).</summary>
    public static string ToPascalCase(string name)
    {
        string camel = ToCamelCase(name);
        if (string.IsNullOrEmpty(camel))
        {
            return camel;
        }

        return char.ToUpperInvariant(camel[0]) + camel[1..];
    }
}
