using Application.Abstractions.Messaging;

namespace Application.Masters.Create;

public sealed record BatchCreateNameBoardsCommand(IReadOnlyList<CreateNameBoardItem> Items)
    : ICommand<BatchCreateNameBoardsResponse>;

public sealed record CreateNameBoardItem(
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone);
