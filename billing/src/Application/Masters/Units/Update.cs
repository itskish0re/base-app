using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Units;

public sealed record BatchUpdateUnitsCommand(IReadOnlyList<UpdateUnitItem> Items)
    : ICommand<BatchUpdateUnitsResponse>;

internal sealed class BatchUpdateUnitsCommandHandler(
    IUnitRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateUnitsCommand, BatchUpdateUnitsResponse>
{
    public async Task<Result<BatchUpdateUnitsResponse>> Handle(
        BatchUpdateUnitsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<UnitResponse>();
        var failures = new List<BatchUnitItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateUnitItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    UnitErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
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

            if (await repository.ExistsByCodeAsync(code, item.UnitId, cancellationToken))
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    UnitErrors.CodeNotUnique.Code,
                    UnitErrors.CodeNotUnique.Description));
                continue;
            }

            entity.Name = item.Name.Trim();
            entity.Code = code;
            entity.IsFixed = item.IsFixed;
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

        return new BatchUpdateUnitsResponse(updated, failures);
    }
}

internal sealed class BatchUpdateUnitsCommandValidator : AbstractValidator<BatchUpdateUnitsCommand>
{
    public BatchUpdateUnitsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.UnitId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        });
    }
}
