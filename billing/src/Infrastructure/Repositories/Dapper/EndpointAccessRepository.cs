using Application.Abstractions.Data;
using Domain.Access;
using Dapper;

namespace Infrastructure.Repositories.Dapper;

internal sealed class EndpointAccessRepository(IDbConnectionFactory connectionFactory) : IEndpointAccessRepository
{
    public async Task<IReadOnlyList<EndpointAccessRule>> GetAllActiveAsync(CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        IEnumerable<EndpointAccessRule> rows = await connection.QueryAsync<EndpointAccessRule>(
            """
            SELECT endpoint_code AS EndpointCode,
                   http_method AS HttpMethod,
                   route_pattern AS RoutePattern,
                   access_mode::text AS AccessMode,
                   is_active AS IsActive
            FROM app_endpoint
            WHERE is_active = true
            """);

        return rows.ToList();
    }

    public async Task<bool> IsAllowedAsync(int roleId, string endpointCode, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        bool allowed = await connection.ExecuteScalarAsync<bool>(
            """
            SELECT EXISTS (
                SELECT 1
                FROM app_endpoint e
                INNER JOIN app_role_endpoint re ON re.endpoint_id = e.endpoint_id
                WHERE e.endpoint_code = @EndpointCode
                  AND e.is_active = true
                  AND re.role_id = @RoleId
                  AND re.is_enabled = true
            )
            """,
            new { RoleId = roleId, EndpointCode = endpointCode });

        return allowed;
    }
}
