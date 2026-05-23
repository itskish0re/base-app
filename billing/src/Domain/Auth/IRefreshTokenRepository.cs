namespace Domain.Auth;

public interface IRefreshTokenRepository
{
    Task<RefreshTokenRecord?> GetActiveByHashAsync(string tokenSha256Hex, CancellationToken cancellationToken = default);

    Task<int> InsertAsync(int userId, string tokenSha256Hex, DateTime expiresAt, CancellationToken cancellationToken = default);

    Task RevokeAsync(int refreshTokenId, int? replacedById, CancellationToken cancellationToken = default);

    Task RevokeAllForUserAsync(int userId, CancellationToken cancellationToken = default);
}
