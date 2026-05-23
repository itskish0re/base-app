using System.Security.Claims;

namespace Application.Abstractions.Authentication;

public interface IJwtTokenService
{
    string CreateAccessToken(AuthUserClaims user);

    string CreateRefreshToken();

    string HashRefreshToken(string refreshToken);
}

public sealed record AuthUserClaims(int UserId, string Email, int RoleId, string RoleCode);
