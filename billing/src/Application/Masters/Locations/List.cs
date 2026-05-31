using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Locations;

public sealed record ListLocationsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedLocationsResponse>;

internal sealed class ListLocationsQueryHandler(ILocationRepository repository)
    : IQueryHandler<ListLocationsQuery, PagedLocationsResponse>
{
    public async Task<Result<PagedLocationsResponse>> Handle(
        ListLocationsQuery request,
        CancellationToken cancellationToken)
    {
        LocationListResult result = await repository.ListAsync(
            new LocationListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<LocationResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedLocationsResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListLocationsQueryValidator : AbstractValidator<ListLocationsQuery>
{
    public ListLocationsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
