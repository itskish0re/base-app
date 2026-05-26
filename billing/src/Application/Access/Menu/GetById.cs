using Application.Abstractions.Messaging;
using Domain.Access;
using SharedKernel;

namespace Application.Access.Menu;

public sealed record GetMenuByIdQuery(int MenuId) : IQuery<MenuResponse>;

internal sealed class GetMenuByIdQueryHandler(IMenuRepository menuRepository)
    : IQueryHandler<GetMenuByIdQuery, MenuResponse>
{
    public async Task<Result<MenuResponse>> Handle(
        GetMenuByIdQuery request,
        CancellationToken cancellationToken)
    {
        AppMenu? menu = await menuRepository.GetByIdAsync(request.MenuId, cancellationToken);

        if (menu is null)
        {
            return Result.Failure<MenuResponse>(MenuErrors.NotFound);
        }

        return menu.ToResponse();
    }
}
