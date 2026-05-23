using Application.Abstractions.Messaging;

namespace Application.Masters.Update;

public sealed record BatchUpdateNameBoardsCommand(IReadOnlyList<UpdateNameBoardItem> Items)
    : ICommand<BatchUpdateNameBoardsResponse>;

public sealed record UpdateNameBoardItem(
    int NameBoardId,
    string Name,
    string Code,
    string OwnerName,
    string? OwnerPhone,
    bool IsEnabled = true,
    bool IsActive = true);
