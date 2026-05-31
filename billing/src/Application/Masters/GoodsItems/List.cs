using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.GoodsItems;

public sealed record ListGoodssQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedGoodssResponse>;

internal sealed class ListGoodssQueryHandler(IGoodsRepository repository)
    : IQueryHandler<ListGoodssQuery, PagedGoodssResponse>
{
    public async Task<Result<PagedGoodssResponse>> Handle(
        ListGoodssQuery request,
        CancellationToken cancellationToken)
    {
        GoodsListResult result = await repository.ListAsync(
            new GoodsListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<GoodsResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedGoodssResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListGoodssQueryValidator : AbstractValidator<ListGoodssQuery>
{
    public ListGoodssQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
