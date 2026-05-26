using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Driver;

public sealed record ListDriversQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedDriversResponse>;

internal sealed class ListDriversQueryHandler(IDriverRepository driverRepository)
    : IQueryHandler<ListDriversQuery, PagedDriversResponse>
{
    public async Task<Result<PagedDriversResponse>> Handle(
        ListDriversQuery request,
        CancellationToken cancellationToken)
    {
        DriverListResult result = await driverRepository.ListAsync(
            new DriverListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<DriverResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedDriversResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListDriversQueryValidator : AbstractValidator<ListDriversQuery>
{
    public ListDriversQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
