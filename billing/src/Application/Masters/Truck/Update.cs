using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Truck;

public sealed record BatchUpdateTrucksCommand(IReadOnlyList<UpdateTruckItem> Items)
    : ICommand<BatchUpdateTrucksResponse>;

internal sealed class BatchUpdateTrucksCommandHandler(
    ITruckRepository truckRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateTrucksCommand, BatchUpdateTrucksResponse>
{
    public async Task<Result<BatchUpdateTrucksResponse>> Handle(
        BatchUpdateTrucksCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<TruckResponse>();
        var failures = new List<BatchTruckItemFailure>();
        var numbersInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateTruckItem item = request.Items[index];
            string truckNumber = item.TruckNumber.Trim();

            if (!numbersInBatch.Add(truckNumber))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.TruckNumberNotUnique.Code,
                    "Duplicate truck number in request batch."));
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

            if (!await truckRepository.NameBoardExistsAsync(item.NameBoardId, cancellationToken))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.NameBoardNotFound.Code,
                    TruckErrors.NameBoardNotFound.Description));
                continue;
            }

            if (await truckRepository.ExistsByTruckNumberAsync(truckNumber, item.TruckId, cancellationToken))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.TruckNumberNotUnique.Code,
                    TruckErrors.TruckNumberNotUnique.Description));
                continue;
            }

            entity.TruckNumber = truckNumber;
            entity.NameBoardId = item.NameBoardId;
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

        return new BatchUpdateTrucksResponse(updated, failures);
    }
}

internal sealed class BatchUpdateTrucksCommandValidator : AbstractValidator<BatchUpdateTrucksCommand>
{
    public BatchUpdateTrucksCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.TruckId).GreaterThan(0);
            item.RuleFor(x => x.TruckNumber).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.NameBoardId).GreaterThan(0);
        });
    }
}
