using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Truck;

public sealed record ListTrucksQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedTrucksResponse>;

internal sealed class ListTrucksQueryHandler(ITruckRepository truckRepository)
    : IQueryHandler<ListTrucksQuery, PagedTrucksResponse>
{
    public async Task<Result<PagedTrucksResponse>> Handle(
        ListTrucksQuery request,
        CancellationToken cancellationToken)
    {
        TruckListResult result = await truckRepository.ListAsync(
            new TruckListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<TruckResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedTrucksResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListTrucksQueryValidator : AbstractValidator<ListTrucksQuery>
{
    public ListTrucksQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
