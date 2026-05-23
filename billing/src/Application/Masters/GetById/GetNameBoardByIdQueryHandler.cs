using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;
using NameBoardResponse = Application.Masters.NameBoardResponse;

namespace Application.Masters.GetById;

internal sealed class GetNameBoardByIdQueryHandler(INameBoardRepository nameBoardRepository)
    : IQueryHandler<GetNameBoardByIdQuery, NameBoardResponse>
{
    public async Task<Result<NameBoardResponse>> Handle(
        GetNameBoardByIdQuery request,
        CancellationToken cancellationToken)
    {
        NameBoard? entity = await nameBoardRepository.GetByIdAsync(request.NameBoardId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<NameBoardResponse>(NameBoardErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
