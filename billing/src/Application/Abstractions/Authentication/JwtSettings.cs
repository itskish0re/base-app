namespace Application.Abstractions.Authentication;

public sealed class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Issuer { get; init; } = "billing-v3";

    public string Audience { get; init; } = "billing-v3-api";

    public string SigningKey { get; init; } = string.Empty;

    public int AccessTokenMinutes { get; init; } = 15;

    /// <summary>When greater than zero, used instead of <see cref="AccessTokenMinutes"/>.</summary>
    public int AccessTokenDays { get; init; }

    public int RefreshTokenDays { get; init; } = 7;

    public DateTime GetAccessTokenExpiresAt(DateTime utcNow) =>
        AccessTokenDays > 0
            ? utcNow.AddDays(AccessTokenDays)
            : utcNow.AddMinutes(AccessTokenMinutes);
}
