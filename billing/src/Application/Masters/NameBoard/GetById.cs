using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.NameBoard;

public sealed record GetNameBoardByIdQuery(int NameBoardId) : IQuery<NameBoardResponse>;

internal sealed class GetNameBoardByIdQueryHandler(INameBoardRepository nameBoardRepository)
    : IQueryHandler<GetNameBoardByIdQuery, NameBoardResponse>
{
    public async Task<Result<NameBoardResponse>> Handle(
        GetNameBoardByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.NameBoard? entity = await nameBoardRepository.GetByIdAsync(request.NameBoardId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<NameBoardResponse>(NameBoardErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
