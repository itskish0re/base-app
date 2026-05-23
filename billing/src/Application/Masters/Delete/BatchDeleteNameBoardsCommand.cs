using Application.Abstractions.Messaging;

namespace Application.Masters.Delete;

public sealed record BatchDeleteNameBoardsCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteNameBoardsResponse>;
