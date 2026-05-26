namespace Domain.Access;

public sealed record NavigationMenu(
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
