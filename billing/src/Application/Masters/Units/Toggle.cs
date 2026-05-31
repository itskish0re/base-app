using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Units;

public sealed record BatchToggleUnitsCommand(IReadOnlyList<ToggleUnitItem> Items)
    : ICommand<BatchToggleUnitsResponse>;

internal sealed class BatchToggleUnitsCommandHandler(
    IUnitRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleUnitsCommand, BatchToggleUnitsResponse>
{
    public async Task<Result<BatchToggleUnitsResponse>> Handle(
        BatchToggleUnitsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<UnitResponse>();
        var failures = new List<BatchUnitItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleUnitItem item = request.Items[index];

            if (!idsInBatch.Add(item.UnitId))
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    "Unit.DuplicateId",
                    "Duplicate id in request batch."));
                continue;
            }

            Domain.Masters.Unit? entity = await repository.GetByIdAsync(item.UnitId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    UnitErrors.NotFound.Code,
                    UnitErrors.NotFound.Description));
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

        return new BatchToggleUnitsResponse(updated, failures);
    }
}

internal sealed class BatchToggleUnitsCommandValidator : AbstractValidator<BatchToggleUnitsCommand>
{
    public BatchToggleUnitsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.UnitId).GreaterThan(0);
        });
    }
}
