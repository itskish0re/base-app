namespace Domain.Access;

public interface IMenuRepository
{
    Task<IReadOnlyList<NavigationMenu>> GetNavigationForRoleAsync(int roleId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RoleMenuMatrixRow>> GetAdminMatrixAsync(CancellationToken cancellationToken = default);

    Task UpsertRoleMenuAsync(int roleId, int menuId, bool isEnabled, bool isDisplayed, int? updatedBy, CancellationToken cancellationToken = default);

    Task<AppMenu?> GetByIdAsync(int menuId, CancellationToken cancellationToken = default);

    Task<MenuListResult> ListAsync(MenuListCriteria criteria, CancellationToken cancellationToken = default);

    Task<bool> ExistsByMenuCodeAsync(string menuCode, int? excludeMenuId, CancellationToken cancellationToken = default);

    Task<bool> ExistsByRoutePathAsync(string routePath, int? excludeMenuId, CancellationToken cancellationToken = default);

    Task<bool> ExistsParentAsync(int parentMenuId, CancellationToken cancellationToken = default);

    Task<bool> HasActiveChildrenAsync(int menuId, CancellationToken cancellationToken = default);

    Task<int> InsertAsync(AppMenu menu, CancellationToken cancellationToken = default);

    Task UpdateAsync(AppMenu menu, CancellationToken cancellationToken = default);
}

public sealed record RoleMenuMatrixRow(
    int RoleId,
    string RoleCode,
    int MenuId,
    string MenuCode,
    bool IsEnabled,
    bool IsDisplayed);

public sealed record MenuListCriteria(
    string? Filter,
    bool? IsActive,
    int Page = 1,
    int PageSize = 20);

public sealed record MenuListResult(
    IReadOnlyList<AppMenu> Items,
    int TotalCount);
