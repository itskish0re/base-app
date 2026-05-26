namespace Domain.Access;

public static class MenuGroups
{
    public const string Main = "main";
    public const string Secondary = "secondary";
    public const string Config = "config";

    private static readonly HashSet<string> ValidGroups = new(StringComparer.OrdinalIgnoreCase)
    {
        Main,
        Secondary,
        Config,
    };

    public static bool IsValid(string? value) =>
        !string.IsNullOrWhiteSpace(value) && ValidGroups.Contains(value.Trim());
}
