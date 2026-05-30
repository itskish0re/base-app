using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Common;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Truck;

public sealed record BatchCreateTrucksCommand(IReadOnlyList<CreateTruckItem> Items)
    : ICommand<BatchCreateTrucksResponse>;

internal sealed class BatchCreateTrucksCommandHandler(
    ITruckRepository truckRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateTrucksCommand, BatchCreateTrucksResponse>
{
    public async Task<Result<BatchCreateTrucksResponse>> Handle(
        BatchCreateTrucksCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.Truck>();
        var failures = new List<BatchTruckItemFailure>();
        var numbersInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateTruckItem item = request.Items[index];
            string truckNumber = TruckNumberNormalizer.Normalize(item.TruckNumber);

            if (!numbersInBatch.Add(truckNumber))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.TruckNumberNotUnique.Code,
                    "Duplicate truck number in request batch."));
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

            if (await truckRepository.ExistsByTruckNumberAsync(truckNumber, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.TruckNumberNotUnique.Code,
                    TruckErrors.TruckNumberNotUnique.Description));
                continue;
            }

            var entity = new Domain.Masters.Truck
            {
                TruckNumber = truckNumber,
                NameBoardId = item.NameBoardId,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            truckRepository.Add(entity);
            entities.Add(entity);
        }

        if (entities.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        IReadOnlyList<TruckResponse> created = entities.Select(e => e.ToResponse()).ToList();

        return new BatchCreateTrucksResponse(created, failures);
    }
}

internal sealed class BatchCreateTrucksCommandValidator : AbstractValidator<BatchCreateTrucksCommand>
{
    public BatchCreateTrucksCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.TruckNumber).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.NameBoardId).GreaterThan(0);
        });
    }
}
