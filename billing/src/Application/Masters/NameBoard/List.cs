using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.NameBoard;

public sealed record ListNameBoardsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedNameBoardsResponse>;

internal sealed class ListNameBoardsQueryHandler(INameBoardRepository nameBoardRepository)
    : IQueryHandler<ListNameBoardsQuery, PagedNameBoardsResponse>
{
    public async Task<Result<PagedNameBoardsResponse>> Handle(
        ListNameBoardsQuery request,
        CancellationToken cancellationToken)
    {
        NameBoardListResult result = await nameBoardRepository.ListAsync(
            new NameBoardListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<NameBoardResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedNameBoardsResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListNameBoardsQueryValidator : AbstractValidator<ListNameBoardsQuery>
{
    public ListNameBoardsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
