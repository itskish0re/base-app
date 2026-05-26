using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.NameBoard;

public sealed record BatchUpdateNameBoardsCommand(IReadOnlyList<UpdateNameBoardItem> Items)
    : ICommand<BatchUpdateNameBoardsResponse>;

internal sealed class BatchUpdateNameBoardsCommandHandler(
    INameBoardRepository nameBoardRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateNameBoardsCommand, BatchUpdateNameBoardsResponse>
{
    public async Task<Result<BatchUpdateNameBoardsResponse>> Handle(
        BatchUpdateNameBoardsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<NameBoardResponse>();
        var failures = new List<BatchNameBoardItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateNameBoardItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
                continue;
            }

            Domain.Masters.NameBoard? entity = await nameBoardRepository.GetByIdAsync(item.NameBoardId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.NotFound.Code,
                    NameBoardErrors.NotFound.Description));
                continue;
            }

            if (await nameBoardRepository.ExistsByCodeAsync(code, item.NameBoardId, cancellationToken))
            {
                failures.Add(new BatchNameBoardItemFailure(
                    index,
                    NameBoardErrors.CodeNotUnique.Code,
                    NameBoardErrors.CodeNotUnique.Description));
                continue;
            }

            entity.Name = item.Name.Trim();
            entity.Code = code;
            entity.OwnerName = item.OwnerName.Trim();
            entity.OwnerPhone = string.IsNullOrWhiteSpace(item.OwnerPhone) ? null : item.OwnerPhone.Trim();
            entity.IsEnabled = item.IsEnabled;
            entity.IsActive = item.IsActive;
            entity.UpdatedAt = utcNow;
            entity.UpdatedBy = userContext.UserId;

            updated.Add(entity.ToResponse());
        }

        if (updated.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new BatchUpdateNameBoardsResponse(updated, failures);
    }
}

internal sealed class BatchUpdateNameBoardsCommandValidator : AbstractValidator<BatchUpdateNameBoardsCommand>
{
    public BatchUpdateNameBoardsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.NameBoardId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.OwnerName).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.OwnerPhone).MaximumLength(32).When(x => x.OwnerPhone is not null);
        });
    }
}
