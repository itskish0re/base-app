using Application.Abstractions.Messaging;

namespace Application.Access.GetNavigation;

public sealed record GetNavigationQuery : IQuery<NavigationResponse>;

public sealed record NavigationResponse(IReadOnlyList<NavigationMenuDto> Menus);

public sealed record NavigationMenuDto(
    int MenuId,
    string MenuCode,
    string DisplayName,
    string RoutePath,
    string? Icon,
    int? ParentMenuId,
    int SortOrder,
    string? Badge,
    string? Tooltip,
    bool DefaultExpanded,
    string MenuGroup);
