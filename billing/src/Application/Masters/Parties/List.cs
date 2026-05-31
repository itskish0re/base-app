using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Parties;

public sealed record ListPartysQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedPartysResponse>;

internal sealed class ListPartysQueryHandler(IPartyRepository repository)
    : IQueryHandler<ListPartysQuery, PagedPartysResponse>
{
    public async Task<Result<PagedPartysResponse>> Handle(
        ListPartysQuery request,
        CancellationToken cancellationToken)
    {
        PartyListResult result = await repository.ListAsync(
            new PartyListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<PartyResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedPartysResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListPartysQueryValidator : AbstractValidator<ListPartysQuery>
{
    public ListPartysQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
