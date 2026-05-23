using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Application.Abstractions.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication;

internal sealed class JwtTokenService(IOptions<JwtSettings> jwtOptions) : IJwtTokenService
{
    public string CreateAccessToken(AuthUserClaims user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("role_id", user.RoleId.ToString()),
            new(ClaimTypes.Role, user.RoleCode),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetSigningKey()));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        JwtSettings jwt = jwtOptions.Value;
        DateTime utcNow = DateTime.UtcNow;

        var token = new JwtSecurityToken(
            issuer: jwt.Issuer,
            audience: jwt.Audience,
            claims: claims,
            expires: jwt.GetAccessTokenExpiresAt(utcNow),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string CreateRefreshToken()
    {
        byte[] bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    public string HashRefreshToken(string refreshToken)
    {
        byte[] hash = SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private string GetSigningKey() =>
        string.IsNullOrWhiteSpace(jwtOptions.Value.SigningKey)
            ? throw new InvalidOperationException("Jwt:SigningKey is not configured.")
            : jwtOptions.Value.SigningKey;
}
