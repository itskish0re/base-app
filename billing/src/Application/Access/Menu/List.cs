using Application.Abstractions.Messaging;
using Domain.Access;
using FluentValidation;
using SharedKernel;

namespace Application.Access.Menu;

public sealed record ListMenusQuery(
    string? Filter,
    bool? IsActive,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedMenusResponse>;

internal sealed class ListMenusQueryHandler(IMenuRepository menuRepository)
    : IQueryHandler<ListMenusQuery, PagedMenusResponse>
{
    public async Task<Result<PagedMenusResponse>> Handle(
        ListMenusQuery request,
        CancellationToken cancellationToken)
    {
        MenuListResult result = await menuRepository.ListAsync(
            new MenuListCriteria(request.Filter, request.IsActive, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<MenuResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedMenusResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListMenusQueryValidator : AbstractValidator<ListMenusQuery>
{
    public ListMenusQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
