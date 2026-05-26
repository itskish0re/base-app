using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Truck;

public sealed record BatchDeleteTrucksCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteTrucksResponse>;

internal sealed class BatchDeleteTrucksCommandHandler(
    ITruckRepository truckRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteTrucksCommand, BatchDeleteTrucksResponse>
{
    public async Task<Result<BatchDeleteTrucksResponse>> Handle(
        BatchDeleteTrucksCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchTruckItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.Truck? entity = await truckRepository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.NotFound.Code,
                    TruckErrors.NotFound.Description));
                continue;
            }

            if (await truckRepository.HasActiveDriversAsync(id, cancellationToken))
            {
                failures.Add(new BatchTruckItemFailure(
                    index,
                    TruckErrors.HasDrivers.Code,
                    TruckErrors.HasDrivers.Description));
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

        return new BatchDeleteTrucksResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteTrucksCommandValidator : AbstractValidator<BatchDeleteTrucksCommand>
{
    public BatchDeleteTrucksCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
