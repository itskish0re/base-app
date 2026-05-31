using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Units;

public sealed record BatchDeleteUnitsCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteUnitsResponse>;

internal sealed class BatchDeleteUnitsCommandHandler(
    IUnitRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteUnitsCommand, BatchDeleteUnitsResponse>
{
    public async Task<Result<BatchDeleteUnitsResponse>> Handle(
        BatchDeleteUnitsCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchUnitItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.Unit? entity = await repository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    UnitErrors.NotFound.Code,
                    UnitErrors.NotFound.Description));
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

        return new BatchDeleteUnitsResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteUnitsCommandValidator : AbstractValidator<BatchDeleteUnitsCommand>
{
    public BatchDeleteUnitsCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
