using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Locations;

public sealed record BatchToggleLocationsCommand(IReadOnlyList<ToggleLocationItem> Items)
    : ICommand<BatchToggleLocationsResponse>;

internal sealed class BatchToggleLocationsCommandHandler(
    ILocationRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleLocationsCommand, BatchToggleLocationsResponse>
{
    public async Task<Result<BatchToggleLocationsResponse>> Handle(
        BatchToggleLocationsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<LocationResponse>();
        var failures = new List<BatchLocationItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleLocationItem item = request.Items[index];

            if (!idsInBatch.Add(item.LocationId))
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    "Location.DuplicateId",
                    "Duplicate id in request batch."));
                continue;
            }

            Domain.Masters.Location? entity = await repository.GetByIdAsync(item.LocationId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    LocationErrors.NotFound.Code,
                    LocationErrors.NotFound.Description));
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

        return new BatchToggleLocationsResponse(updated, failures);
    }
}

internal sealed class BatchToggleLocationsCommandValidator : AbstractValidator<BatchToggleLocationsCommand>
{
    public BatchToggleLocationsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.LocationId).GreaterThan(0);
        });
    }
}
