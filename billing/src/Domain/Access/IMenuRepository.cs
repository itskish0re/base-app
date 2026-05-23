namespace Domain.Access;

public interface IMenuRepository
{
    Task<IReadOnlyList<NavigationMenu>> GetNavigationForRoleAsync(int roleId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RoleMenuMatrixRow>> GetAdminMatrixAsync(CancellationToken cancellationToken = default);

    Task UpsertRoleMenuAsync(int roleId, int menuId, bool isEnabled, bool isDisplayed, int? updatedBy, CancellationToken cancellationToken = default);
}

public sealed record RoleMenuMatrixRow(
    int RoleId,
    string RoleCode,
    int MenuId,
    string MenuCode,
    bool IsEnabled,
    bool IsDisplayed);
