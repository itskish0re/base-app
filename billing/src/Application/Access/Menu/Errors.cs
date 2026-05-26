using SharedKernel;

namespace Application.Access.Menu;

internal static class MenuErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Menu.NotFound",
        "Menu was not found.");

    public static readonly Error MenuCodeNotUnique = Error.Conflict(
        "Menu.MenuCodeNotUnique",
        "A menu with this code already exists.");

    public static readonly Error RoutePathNotUnique = Error.Conflict(
        "Menu.RoutePathNotUnique",
        "A menu with this route path already exists.");

    public static readonly Error ParentNotFound = Error.NotFound(
        "Menu.ParentNotFound",
        "Parent menu was not found or is inactive.");

    public static readonly Error InvalidParent = Error.Problem(
        "Menu.InvalidParent",
        "A menu cannot be its own parent.");

    public static readonly Error HasChildren = Error.Conflict(
        "Menu.HasChildren",
        "Cannot deactivate a menu that has active child menus.");
}
