using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Driver;

public sealed record BatchToggleDriversCommand(IReadOnlyList<ToggleDriverItem> Items)
    : ICommand<BatchToggleDriversResponse>;

internal sealed class BatchToggleDriversCommandHandler(
    IDriverRepository driverRepository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleDriversCommand, BatchToggleDriversResponse>
{
    public async Task<Result<BatchToggleDriversResponse>> Handle(
        BatchToggleDriversCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<DriverResponse>();
        var failures = new List<BatchDriverItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleDriverItem item = request.Items[index];

            if (!idsInBatch.Add(item.DriverId))
            {
                failures.Add(new BatchDriverItemFailure(
                    index,
                    "Driver.DuplicateId",
                    "Duplicate driverId in request batch."));
                continue;
            }

            Domain.Masters.Driver? entity = await driverRepository.GetByIdAsync(item.DriverId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchDriverItemFailure(
                    index,
                    DriverErrors.NotFound.Code,
                    DriverErrors.NotFound.Description));
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

        return new BatchToggleDriversResponse(updated, failures);
    }
}

internal sealed class BatchToggleDriversCommandValidator : AbstractValidator<BatchToggleDriversCommand>
{
    public BatchToggleDriversCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.DriverId).GreaterThan(0);
        });
    }
}
