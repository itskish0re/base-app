using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Units;

public sealed record ListUnitsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedUnitsResponse>;

internal sealed class ListUnitsQueryHandler(IUnitRepository repository)
    : IQueryHandler<ListUnitsQuery, PagedUnitsResponse>
{
    public async Task<Result<PagedUnitsResponse>> Handle(
        ListUnitsQuery request,
        CancellationToken cancellationToken)
    {
        UnitListResult result = await repository.ListAsync(
            new UnitListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<UnitResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedUnitsResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListUnitsQueryValidator : AbstractValidator<ListUnitsQuery>
{
    public ListUnitsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
