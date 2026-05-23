using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Toggle;

internal sealed class BatchToggleNameBoardsCommandHandler(
    INameBoardRepository nameBoardRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleNameBoardsCommand, BatchToggleNameBoardsResponse>
{
    public async Task<Result<BatchToggleNameBoardsResponse>> Handle(
        BatchToggleNameBoardsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<NameBoardResponse>();
        var failures = new List<BatchNameBoardItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleNameBoardItem item = request.Items[index];

            if (!idsInBatch.Add(item.NameBoardId))
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    "NameBoard.DuplicateId",
                    "Duplicate nameBoardId in request batch."));
                continue;
            }

            NameBoard? entity = await nameBoardRepository.GetByIdAsync(item.NameBoardId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.NotFound.Code,
                    NameBoardErrors.NotFound.Description));
                continue;
            }

            entity.IsEnabled = item.IsEnabled;
            entity.UpdatedAt = utcNow;
            entity.UpdatedBy = userContext.UserId;

            updated.Add(entity.ToResponse());
        }

        if (updated.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new BatchToggleNameBoardsResponse(updated, failures);
    }
}
