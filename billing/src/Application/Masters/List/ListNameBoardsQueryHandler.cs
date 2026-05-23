using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;
using NameBoardResponse = Application.Masters.NameBoardResponse;
using PagedNameBoardsResponse = Application.Masters.PagedNameBoardsResponse;

namespace Application.Masters.List;

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
