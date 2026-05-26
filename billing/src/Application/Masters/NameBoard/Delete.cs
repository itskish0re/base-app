using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.NameBoard;

public sealed record BatchDeleteNameBoardsCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteNameBoardsResponse>;

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
            Domain.Masters.NameBoard? entity = await nameBoardRepository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.NotFound.Code,
                    NameBoardErrors.NotFound.Description));
                continue;
            }

            if (await nameBoardRepository.HasActiveTrucksAsync(id, cancellationToken))
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.HasTrucks.Code,
                    NameBoardErrors.HasTrucks.Description));
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

internal sealed class BatchDeleteNameBoardsCommandValidator : AbstractValidator<BatchDeleteNameBoardsCommand>
{
    public BatchDeleteNameBoardsCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
