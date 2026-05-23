using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Create;

internal sealed class BatchCreateNameBoardsCommandHandler(
    INameBoardRepository nameBoardRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateNameBoardsCommand, BatchCreateNameBoardsResponse>
{
    public async Task<Result<BatchCreateNameBoardsResponse>> Handle(
        BatchCreateNameBoardsCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<NameBoard>();
        var failures = new List<BatchNameBoardItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateNameBoardItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
                continue;
            }

            if (await nameBoardRepository.ExistsByCodeAsync(code, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.CodeNotUnique.Code,
                    NameBoardErrors.CodeNotUnique.Description));
                continue;
            }

            var entity = new NameBoard
            {
                Name = item.Name.Trim(),
                Code = code,
                OwnerName = item.OwnerName.Trim(),
                OwnerPhone = string.IsNullOrWhiteSpace(item.OwnerPhone) ? null : item.OwnerPhone.Trim(),
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            nameBoardRepository.Add(entity);
            entities.Add(entity);
        }

        if (entities.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        IReadOnlyList<NameBoardResponse> created = entities.Select(e => e.ToResponse()).ToList();

        return new BatchCreateNameBoardsResponse(created, failures);
    }
}
