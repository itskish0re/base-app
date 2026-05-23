using Application.Abstractions.Messaging;

namespace Application.Masters.Toggle;

public sealed record BatchToggleNameBoardsCommand(IReadOnlyList<ToggleNameBoardItem> Items)
    : ICommand<BatchToggleNameBoardsResponse>;

public sealed record ToggleNameBoardItem(int NameBoardId, bool IsEnabled);
