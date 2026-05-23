using Application.Abstractions.Messaging;

namespace Application.Auth.Refresh;

public sealed record RefreshTokenCommand(string RefreshToken) : ICommand<RefreshTokenResponse>;

public sealed record RefreshTokenResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt);
