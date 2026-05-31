using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Parties;

public sealed record BatchDeletePartysCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeletePartysResponse>;

internal sealed class BatchDeletePartysCommandHandler(
    IPartyRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeletePartysCommand, BatchDeletePartysResponse>
{
    public async Task<Result<BatchDeletePartysResponse>> Handle(
        BatchDeletePartysCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchPartyItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.Party? entity = await repository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchPartyItemFailure(
                    index,
                    PartyErrors.NotFound.Code,
                    PartyErrors.NotFound.Description));
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

        return new BatchDeletePartysResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeletePartysCommandValidator : AbstractValidator<BatchDeletePartysCommand>
{
    public BatchDeletePartysCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
