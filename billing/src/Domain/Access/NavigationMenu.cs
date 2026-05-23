namespace Domain.Access;

public sealed record NavigationMenu(
    int MenuId,
    string MenuCode,
    string DisplayName,
    string RoutePath,
    string? Icon,
    int? ParentMenuId,
    int SortOrder);
