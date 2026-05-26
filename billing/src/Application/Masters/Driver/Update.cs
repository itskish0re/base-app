using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Driver;

public sealed record BatchUpdateDriversCommand(IReadOnlyList<UpdateDriverItem> Items)
    : ICommand<BatchUpdateDriversResponse>;

internal sealed class BatchUpdateDriversCommandHandler(
    IDriverRepository driverRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateDriversCommand, BatchUpdateDriversResponse>
{
    public async Task<Result<BatchUpdateDriversResponse>> Handle(
        BatchUpdateDriversCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<DriverResponse>();
        var failures = new List<BatchDriverItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateDriverItem item = request.Items[index];

            Domain.Masters.Driver? entity = await driverRepository.GetByIdAsync(item.DriverId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchDriverItemFailure(
                    index,
                    DriverErrors.NotFound.Code,
                    DriverErrors.NotFound.Description));
                continue;
            }

            if (!await driverRepository.TruckExistsAsync(item.TruckId, cancellationToken))
            {
                failures.Add(new BatchDriverItemFailure(
                    index,
                    DriverErrors.TruckNotFound.Code,
                    DriverErrors.TruckNotFound.Description));
                continue;
            }

            entity.Name = item.Name.Trim();
            entity.Mobile = item.Mobile.Trim();
            entity.TruckId = item.TruckId;
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

        return new BatchUpdateDriversResponse(updated, failures);
    }
}

internal sealed class BatchUpdateDriversCommandValidator : AbstractValidator<BatchUpdateDriversCommand>
{
    public BatchUpdateDriversCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.DriverId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Mobile).NotEmpty().MaximumLength(32);
            item.RuleFor(x => x.TruckId).GreaterThan(0);
        });
    }
}
