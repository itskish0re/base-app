using Domain.Access;

namespace Application.Access.Menu;

public sealed record MenuResponse(
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
    string MenuGroup,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record PagedMenusResponse(
    IReadOnlyList<MenuResponse> Items,
    int Page,
    int PageSize,
    int TotalCount);

public sealed record BatchMenuItemFailure(int Index, string ErrorCode, string Message);

public sealed record BatchCreateMenusResponse(
    IReadOnlyList<MenuResponse> Created,
    IReadOnlyList<BatchMenuItemFailure> Failures);

public sealed record BatchUpdateMenusResponse(
    IReadOnlyList<MenuResponse> Updated,
    IReadOnlyList<BatchMenuItemFailure> Failures);

public sealed record BatchDeleteMenusResponse(
    IReadOnlyList<int> DeletedIds,
    IReadOnlyList<BatchMenuItemFailure> Failures);

public sealed record BatchToggleMenusResponse(
    IReadOnlyList<MenuResponse> Updated,
    IReadOnlyList<BatchMenuItemFailure> Failures);

public sealed record CreateMenuItem(
    string MenuCode,
    string DisplayName,
    string RoutePath,
    string? Icon,
    int? ParentMenuId,
    int SortOrder,
    string? Badge,
    string? Tooltip,
    bool DefaultExpanded,
    string MenuGroup = MenuGroups.Main);

public sealed record UpdateMenuItem(
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
    string MenuGroup,
    bool IsActive);

public sealed record ToggleMenuItem(int MenuId, bool IsActive);

public sealed record BatchCreateMenusRequest(IReadOnlyList<CreateMenuItemRequest> Items);

public sealed record CreateMenuItemRequest(
    string MenuCode,
    string DisplayName,
    string RoutePath,
    string? Icon,
    int? ParentMenuId,
    int SortOrder,
    string? Badge = null,
    string? Tooltip = null,
    bool DefaultExpanded = true,
    string MenuGroup = MenuGroups.Main);

public sealed record BatchUpdateMenusRequest(IReadOnlyList<UpdateMenuItemRequest> Items);

public sealed record UpdateMenuItemRequest(
    int MenuId,
    string MenuCode,
    string DisplayName,
    string RoutePath,
    string? Icon,
    int? ParentMenuId,
    int SortOrder,
    string? Badge = null,
    string? Tooltip = null,
    bool DefaultExpanded = true,
    string MenuGroup = MenuGroups.Main,
    bool IsActive = true);

public sealed record BatchDeleteMenusRequest(IReadOnlyList<int> Ids);

public sealed record BatchToggleMenusRequest(IReadOnlyList<ToggleMenuItemRequest> Items);

public sealed record ToggleMenuItemRequest(int MenuId, bool IsActive);
