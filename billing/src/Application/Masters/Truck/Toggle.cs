using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Truck;

public sealed record BatchToggleTrucksCommand(IReadOnlyList<ToggleTruckItem> Items)
    : ICommand<BatchToggleTrucksResponse>;

internal sealed class BatchToggleTrucksCommandHandler(
    ITruckRepository truckRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleTrucksCommand, BatchToggleTrucksResponse>
{
    public async Task<Result<BatchToggleTrucksResponse>> Handle(
        BatchToggleTrucksCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<TruckResponse>();
        var failures = new List<BatchTruckItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleTruckItem item = request.Items[index];

            if (!idsInBatch.Add(item.TruckId))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    "Truck.DuplicateId",
                    "Duplicate truckId in request batch."));
                continue;
            }

            Domain.Masters.Truck? entity = await truckRepository.GetByIdAsync(item.TruckId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.NotFound.Code,
                    TruckErrors.NotFound.Description));
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

        return new BatchToggleTrucksResponse(updated, failures);
    }
}

internal sealed class BatchToggleTrucksCommandValidator : AbstractValidator<BatchToggleTrucksCommand>
{
    public BatchToggleTrucksCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.TruckId).GreaterThan(0);
        });
    }
}
