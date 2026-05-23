using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using SharedKernel;
using Domain.Auth;
using Microsoft.Extensions.Options;

namespace Application.Auth.Login;

internal sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    IOptions<JwtSettings> jwtOptions) : ICommandHandler<LoginCommand, LoginResponse>
{
    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        AuthUser? user = await userRepository.GetByEmailAsync(request.Email.Trim(), cancellationToken);

        if (user is null || !user.IsActive)
        {
            return Result.Failure<LoginResponse>(Error.Problem("Auth.InvalidCredentials", "Invalid email or password."));
        }

        if (!passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Result.Failure<LoginResponse>(Error.Problem("Auth.InvalidCredentials", "Invalid email or password."));
        }

        string refreshToken = jwtTokenService.CreateRefreshToken();
        string refreshHash = jwtTokenService.HashRefreshToken(refreshToken);
        JwtSettings jwt = jwtOptions.Value;
        DateTime refreshExpires = DateTime.UtcNow.AddDays(jwt.RefreshTokenDays);

        await refreshTokenRepository.InsertAsync(user.UserId, refreshHash, refreshExpires, cancellationToken);

        var claims = new AuthUserClaims(user.UserId, user.Email, user.RoleId, user.RoleCode);
        string accessToken = jwtTokenService.CreateAccessToken(claims);

        return new LoginResponse(
            accessToken,
            refreshToken,
            jwt.GetAccessTokenExpiresAt(DateTime.UtcNow),
            refreshExpires);
    }
}
