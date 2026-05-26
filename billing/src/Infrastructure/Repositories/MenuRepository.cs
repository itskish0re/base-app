using Domain.Access;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal sealed class MenuRepository(BillingDbContext context) : IMenuRepository
{
    public async Task<IReadOnlyList<NavigationMenu>> GetNavigationForRoleAsync(
        int roleId,
        CancellationToken cancellationToken = default) =>
        await context.AppMenus
            .AsNoTracking()
            .Where(m => m.IsActive)
            .Where(m => context.AppRoleMenus.Any(rm =>
                rm.RoleId == roleId
                && rm.MenuId == m.MenuId
                && rm.IsEnabled
                && rm.IsDisplayed))
            .OrderBy(m => m.SortOrder)
            .ThenBy(m => m.MenuId)
            .Select(m => new NavigationMenu(
                m.MenuId,
                m.MenuCode,
                m.DisplayName,
                m.RoutePath,
                m.Icon,
                m.ParentMenuId,
                m.SortOrder,
                m.Badge,
                m.Tooltip,
                m.DefaultExpanded,
                m.MenuGroup))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<RoleMenuMatrixRow>> GetAdminMatrixAsync(
        CancellationToken cancellationToken = default) =>
        await (
            from role in context.AppRoles.AsNoTracking()
            from menu in context.AppMenus.AsNoTracking().Where(m => m.IsActive)
            join roleMenu in context.AppRoleMenus.AsNoTracking()
                on new { role.RoleId, menu.MenuId } equals new { roleMenu.RoleId, roleMenu.MenuId }
                into roleMenus
            from roleMenu in roleMenus.DefaultIfEmpty()
            orderby role.RoleId, menu.SortOrder
            select new RoleMenuMatrixRow(
                role.RoleId,
                role.RoleCode,
                menu.MenuId,
                menu.MenuCode,
                roleMenu != null && roleMenu.IsEnabled,
                roleMenu != null && roleMenu.IsDisplayed))
            .ToListAsync(cancellationToken);

    public async Task UpsertRoleMenuAsync(
        int roleId,
        int menuId,
        bool isEnabled,
        bool isDisplayed,
        int? updatedBy,
        CancellationToken cancellationToken = default)
    {
        DateTime utcNow = DateTime.UtcNow;

        AppRoleMenu? existing = await context.AppRoleMenus
            .FirstOrDefaultAsync(x => x.RoleId == roleId && x.MenuId == menuId, cancellationToken);

        if (existing is null)
        {
            context.AppRoleMenus.Add(new AppRoleMenu
            {
                RoleId = roleId,
                MenuId = menuId,
                IsEnabled = isEnabled,
                IsDisplayed = isDisplayed,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = updatedBy,
                UpdatedBy = updatedBy,
            });
        }
        else
        {
            existing.IsEnabled = isEnabled;
            existing.IsDisplayed = isDisplayed;
            existing.UpdatedAt = utcNow;
            existing.UpdatedBy = updatedBy;
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<AppMenu?> GetByIdAsync(int menuId, CancellationToken cancellationToken = default) =>
        await context.AppMenus
            .FirstOrDefaultAsync(x => x.MenuId == menuId, cancellationToken);

    public async Task<MenuListResult> ListAsync(MenuListCriteria criteria, CancellationToken cancellationToken = default)
    {
        IQueryable<AppMenu> query = context.AppMenus.AsNoTracking();

        string filter = criteria.Filter?.Trim() ?? string.Empty;
        if (filter.Length > 0)
        {
            string pattern = $"%{filter}%";
            query = query.Where(x =>
                EF.Functions.ILike(x.MenuCode, pattern)
                || EF.Functions.ILike(x.DisplayName, pattern)
                || EF.Functions.ILike(x.RoutePath, pattern));
        }

        if (criteria.IsActive is bool isActive)
        {
            query = query.Where(x => x.IsActive == isActive);
        }

        int totalCount = await query.CountAsync(cancellationToken);

        List<AppMenu> items = await query
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.MenuId)
            .Skip((criteria.Page - 1) * criteria.PageSize)
            .Take(criteria.PageSize)
            .ToListAsync(cancellationToken);

        return new MenuListResult(items, totalCount);
    }

    public async Task<bool> ExistsByMenuCodeAsync(
        string menuCode,
        int? excludeMenuId,
        CancellationToken cancellationToken = default)
    {
        string normalized = menuCode.Trim();
        return await context.AppMenus.AnyAsync(
            x => EF.Functions.ILike(x.MenuCode, normalized)
                 && (excludeMenuId == null || x.MenuId != excludeMenuId),
            cancellationToken);
    }

    public async Task<bool> ExistsByRoutePathAsync(
        string routePath,
        int? excludeMenuId,
        CancellationToken cancellationToken = default)
    {
        string normalized = routePath.Trim();
        return await context.AppMenus.AnyAsync(
            x => EF.Functions.ILike(x.RoutePath, normalized)
                 && (excludeMenuId == null || x.MenuId != excludeMenuId),
            cancellationToken);
    }

    public async Task<bool> ExistsParentAsync(int parentMenuId, CancellationToken cancellationToken = default) =>
        await context.AppMenus.AnyAsync(
            x => x.MenuId == parentMenuId && x.IsActive,
            cancellationToken);

    public async Task<bool> HasActiveChildrenAsync(int menuId, CancellationToken cancellationToken = default) =>
        await context.AppMenus.AnyAsync(
            x => x.ParentMenuId == menuId && x.IsActive,
            cancellationToken);

    public async Task<int> InsertAsync(AppMenu menu, CancellationToken cancellationToken = default)
    {
        context.AppMenus.Add(menu);
        await context.SaveChangesAsync(cancellationToken);
        return menu.MenuId;
    }

    public async Task UpdateAsync(AppMenu menu, CancellationToken cancellationToken = default)
    {
        context.AppMenus.Update(menu);
        await context.SaveChangesAsync(cancellationToken);
    }
}
