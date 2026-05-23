using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Delete;

internal sealed class BatchDeleteNameBoardsCommandHandler(
    INameBoardRepository nameBoardRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteNameBoardsCommand, BatchDeleteNameBoardsResponse>
{
    public async Task<Result<BatchDeleteNameBoardsResponse>> Handle(
        BatchDeleteNameBoardsCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchNameBoardItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            NameBoard? entity = await nameBoardRepository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.NotFound.Code,
                    NameBoardErrors.NotFound.Description));
                continue;
            }

            entity.IsDeleted = true;
            entity.DeletedAt = utcNow;
            entity.UpdatedAt = utcNow;
            entity.UpdatedBy = userContext.UserId;
            deletedIds.Add(id);
        }

        if (deletedIds.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new BatchDeleteNameBoardsResponse(deletedIds, failures);
    }
}
