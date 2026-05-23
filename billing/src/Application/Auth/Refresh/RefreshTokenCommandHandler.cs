using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using SharedKernel;
using Domain.Auth;
using Microsoft.Extensions.Options;

namespace Application.Auth.Refresh;

internal sealed class RefreshTokenCommandHandler(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IJwtTokenService jwtTokenService,
    IOptions<JwtSettings> jwtOptions) : ICommandHandler<RefreshTokenCommand, RefreshTokenResponse>
{
    public async Task<Result<RefreshTokenResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        string hash = jwtTokenService.HashRefreshToken(request.RefreshToken);
        RefreshTokenRecord? existing = await refreshTokenRepository.GetActiveByHashAsync(hash, cancellationToken);

        if (existing is null || existing.RevokedAt is not null || existing.ExpiresAt <= DateTime.UtcNow)
        {
            return Result.Failure<RefreshTokenResponse>(Error.Problem("Auth.InvalidRefreshToken", "Refresh token is invalid or expired."));
        }

        AuthUser? user = await userRepository.GetByIdAsync(existing.UserId, cancellationToken);

        if (user is null || !user.IsActive)
        {
            return Result.Failure<RefreshTokenResponse>(Error.Problem("Auth.InvalidRefreshToken", "Refresh token is invalid or expired."));
        }

        string newRefreshToken = jwtTokenService.CreateRefreshToken();
        string newHash = jwtTokenService.HashRefreshToken(newRefreshToken);
        JwtSettings jwt = jwtOptions.Value;
        DateTime refreshExpires = DateTime.UtcNow.AddDays(jwt.RefreshTokenDays);

        int newId = await refreshTokenRepository.InsertAsync(user.UserId, newHash, refreshExpires, cancellationToken);
        await refreshTokenRepository.RevokeAsync(existing.RefreshTokenId, newId, cancellationToken);

        var claims = new AuthUserClaims(user.UserId, user.Email, user.RoleId, user.RoleCode);
        string accessToken = jwtTokenService.CreateAccessToken(claims);

        return new RefreshTokenResponse(
            accessToken,
            newRefreshToken,
            jwt.GetAccessTokenExpiresAt(DateTime.UtcNow),
            refreshExpires);
    }
}
