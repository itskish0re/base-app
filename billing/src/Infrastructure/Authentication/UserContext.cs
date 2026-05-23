using System.Security.Claims;
using Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication;

internal sealed class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    public int? UserId => GetIntClaim(ClaimTypes.NameIdentifier);

    public int? RoleId => GetIntClaim("role_id");

    public string? RoleCode => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

    public bool IsAuthenticated =>
        httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true;

    private int? GetIntClaim(string claimType)
    {
        string? value = httpContextAccessor.HttpContext?.User?.FindFirstValue(claimType);
        return int.TryParse(value, out int parsed) ? parsed : null;
    }
}
