using Domain.Access;

namespace Application.Access.Menu;

internal static class MenuMappings
{
    internal static MenuResponse ToResponse(this AppMenu menu) =>
        new(
            menu.MenuId,
            menu.MenuCode,
            menu.DisplayName,
            menu.RoutePath,
            menu.Icon,
            menu.ParentMenuId,
            menu.SortOrder,
            menu.Badge,
            menu.Tooltip,
            menu.DefaultExpanded,
            menu.MenuGroup,
            menu.IsActive,
            menu.CreatedAt,
            menu.UpdatedAt);
}
