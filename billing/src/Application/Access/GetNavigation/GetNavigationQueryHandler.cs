using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using SharedKernel;
using Domain.Access;

namespace Application.Access.GetNavigation;

internal sealed class GetNavigationQueryHandler(
    IUserContext userContext,
    IMenuRepository menuRepository) : IQueryHandler<GetNavigationQuery, NavigationResponse>
{
    public async Task<Result<NavigationResponse>> Handle(GetNavigationQuery request, CancellationToken cancellationToken)
    {
        if (userContext.RoleId is not int roleId)
        {
            return Result.Failure<NavigationResponse>(Error.Problem("Auth.Unauthorized", "User is not authenticated."));
        }

        IReadOnlyList<NavigationMenu> menus = await menuRepository.GetNavigationForRoleAsync(roleId, cancellationToken);

        var dtos = menus
            .Select(m => new NavigationMenuDto(m.MenuId, m.MenuCode, m.DisplayName, m.RoutePath, m.Icon, m.ParentMenuId, m.SortOrder))
            .ToList();

        return new NavigationResponse(dtos);
    }
}
