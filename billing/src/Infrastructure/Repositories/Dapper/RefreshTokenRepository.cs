using Application.Abstractions.Data;
using Domain.Auth;
using Dapper;

namespace Infrastructure.Repositories.Dapper;

internal sealed class RefreshTokenRepository(IDbConnectionFactory connectionFactory) : IRefreshTokenRepository
{
    public async Task<RefreshTokenRecord?> GetActiveByHashAsync(string tokenSha256Hex, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        return await connection.QuerySingleOrDefaultAsync<RefreshTokenRecord>(
            """
            SELECT refresh_token_id AS RefreshTokenId,
                   user_id AS UserId,
                   token_sha256_hex AS TokenSha256Hex,
                   expires_at AS ExpiresAt,
                   revoked_at AS RevokedAt,
                   replaced_by_id AS ReplacedById
            FROM refresh_token
            WHERE token_sha256_hex = @TokenSha256Hex
              AND revoked_at IS NULL
            """,
            new { TokenSha256Hex = tokenSha256Hex });
    }

    public async Task<int> InsertAsync(int userId, string tokenSha256Hex, DateTime expiresAt, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        return await connection.ExecuteScalarAsync<int>(
            """
            INSERT INTO refresh_token (user_id, token_sha256_hex, expires_at)
            VALUES (@UserId, @TokenSha256Hex, @ExpiresAt)
            RETURNING refresh_token_id
            """,
            new { UserId = userId, TokenSha256Hex = tokenSha256Hex, ExpiresAt = expiresAt });
    }

    public async Task RevokeAsync(int refreshTokenId, int? replacedById, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        await connection.ExecuteAsync(
            """
            UPDATE refresh_token
            SET revoked_at = now(), replaced_by_id = @ReplacedById
            WHERE refresh_token_id = @RefreshTokenId
            """,
            new { RefreshTokenId = refreshTokenId, ReplacedById = replacedById });
    }

    public async Task RevokeAllForUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        await connection.ExecuteAsync(
            """
            UPDATE refresh_token
            SET revoked_at = now()
            WHERE user_id = @UserId AND revoked_at IS NULL
            """,
            new { UserId = userId });
    }
}
