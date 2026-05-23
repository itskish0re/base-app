using Application.Abstractions.Messaging;

namespace Application.Masters.List;

public sealed record ListNameBoardsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<Masters.PagedNameBoardsResponse>;
