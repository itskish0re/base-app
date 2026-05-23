using Application.Abstractions.Messaging;

namespace Application.Masters.GetById;

public sealed record GetNameBoardByIdQuery(int NameBoardId) : IQuery<Masters.NameBoardResponse>;
