using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.NameBoard;

public sealed record BatchCreateNameBoardsCommand(IReadOnlyList<CreateNameBoardItem> Items)
    : ICommand<BatchCreateNameBoardsResponse>;

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
        var entities = new List<Domain.Masters.NameBoard>();
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

            var entity = new Domain.Masters.NameBoard
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

internal sealed class BatchCreateNameBoardsCommandValidator : AbstractValidator<BatchCreateNameBoardsCommand>
{
    public BatchCreateNameBoardsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.OwnerName).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.OwnerPhone).MaximumLength(32).When(x => x.OwnerPhone is not null);
        });
    }
}
