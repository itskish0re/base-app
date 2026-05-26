using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication;

internal sealed class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    public int? UserId =>
        GetIntClaim(ClaimTypes.NameIdentifier)
        ?? GetIntClaim(JwtRegisteredClaimNames.Sub);

    public int? RoleId => GetIntClaim(BillingClaimTypes.RoleId);

    public string? RoleCode =>
        httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role)
        ?? httpContextAccessor.HttpContext?.User?.FindFirstValue("role");

    public bool IsAuthenticated =>
        httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true;

    private int? GetIntClaim(string claimType)
    {
        ClaimsPrincipal? user = httpContextAccessor.HttpContext?.User;
        if (user is null)
        {
            return null;
        }

        foreach (Claim claim in user.Claims)
        {
            if (!ClaimTypeMatches(claim.Type, claimType))
            {
                continue;
            }

            if (int.TryParse(claim.Value, out int parsed))
            {
                return parsed;
            }
        }

        return null;
    }

    private static bool ClaimTypeMatches(string actualType, string expectedType) =>
        actualType.Equals(expectedType, StringComparison.OrdinalIgnoreCase)
        || actualType.EndsWith($"/{expectedType}", StringComparison.OrdinalIgnoreCase);
}
