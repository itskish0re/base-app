using Application.Abstractions.Data;
using Domain.Access;
using Dapper;

namespace Infrastructure.Repositories.Dapper;

internal sealed class MenuRepository(IDbConnectionFactory connectionFactory) : IMenuRepository
{
    public async Task<IReadOnlyList<NavigationMenu>> GetNavigationForRoleAsync(int roleId, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        IEnumerable<NavigationMenu> rows = await connection.QueryAsync<NavigationMenu>(
            """
            SELECT m.menu_id AS MenuId,
                   m.menu_code AS MenuCode,
                   m.display_name AS DisplayName,
                   m.route_path AS RoutePath,
                   m.icon AS Icon,
                   m.parent_menu_id AS ParentMenuId,
                   m.sort_order AS SortOrder
            FROM app_menu m
            INNER JOIN app_role_menu rm ON rm.menu_id = m.menu_id
            WHERE rm.role_id = @RoleId
              AND rm.is_enabled = true
              AND rm.is_displayed = true
              AND m.is_active = true
            ORDER BY m.sort_order, m.menu_id
            """,
            new { RoleId = roleId });

        return rows.ToList();
    }

    public async Task<IReadOnlyList<RoleMenuMatrixRow>> GetAdminMatrixAsync(CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        IEnumerable<RoleMenuMatrixRow> rows = await connection.QueryAsync<RoleMenuMatrixRow>(
            """
            SELECT r.role_id AS RoleId,
                   r.role_code AS RoleCode,
                   m.menu_id AS MenuId,
                   m.menu_code AS MenuCode,
                   COALESCE(rm.is_enabled, false) AS IsEnabled,
                   COALESCE(rm.is_displayed, false) AS IsDisplayed
            FROM app_role r
            CROSS JOIN app_menu m
            LEFT JOIN app_role_menu rm ON rm.role_id = r.role_id AND rm.menu_id = m.menu_id
            WHERE m.is_active = true
            ORDER BY r.role_id, m.sort_order
            """);

        return rows.ToList();
    }

    public async Task UpsertRoleMenuAsync(int roleId, int menuId, bool isEnabled, bool isDisplayed, int? updatedBy, CancellationToken cancellationToken = default)
    {
        using System.Data.IDbConnection connection = connectionFactory.GetOpenConnection();

        await connection.ExecuteAsync(
            """
            INSERT INTO app_role_menu (role_id, menu_id, is_enabled, is_displayed, created_by, updated_by)
            VALUES (@RoleId, @MenuId, @IsEnabled, @IsDisplayed, @UpdatedBy, @UpdatedBy)
            ON CONFLICT (role_id, menu_id) DO UPDATE
            SET is_enabled = EXCLUDED.is_enabled,
                is_displayed = EXCLUDED.is_displayed,
                updated_at = now(),
                updated_by = EXCLUDED.updated_by
            """,
            new { RoleId = roleId, MenuId = menuId, IsEnabled = isEnabled, IsDisplayed = isDisplayed, UpdatedBy = updatedBy });
    }
}
