using Application.Abstractions.Data;
using Domain.Auth;
using Dapper;

namespace Infrastructure.Repositories.Dapper;

internal sealed class UserRepository(IDbConnectionFactory connectionFactory) : IUserRepository
{
    private const string SelectSql = """
        SELECT u.user_id AS UserId,
               u.email AS Email,
               u.password_hash AS PasswordHash,
               u.role_id AS RoleId,
               r.role_code AS RoleCode,
               u.is_active AS IsActive
        FROM app_user u
        INNER JOIN app_role r ON r.role_id = u.role_id
        """;

    public async Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        return await connection.QuerySingleOrDefaultAsync<AuthUser>(
            $"{SelectSql} WHERE lower(trim(u.email)) = lower(trim(@Email))",
            new { Email = email });
    }

    public async Task<AuthUser?> GetByIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        return await connection.QuerySingleOrDefaultAsync<AuthUser>(
            $"{SelectSql} WHERE u.user_id = @UserId",
            new { UserId = userId });
    }
}
