using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Locations;

public sealed record BatchUpdateLocationsCommand(IReadOnlyList<UpdateLocationItem> Items)
    : ICommand<BatchUpdateLocationsResponse>;

internal sealed class BatchUpdateLocationsCommandHandler(
    ILocationRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateLocationsCommand, BatchUpdateLocationsResponse>
{
    public async Task<Result<BatchUpdateLocationsResponse>> Handle(
        BatchUpdateLocationsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<LocationResponse>();
        var failures = new List<BatchLocationItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateLocationItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    LocationErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
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

            if (await repository.ExistsByCodeAsync(code, item.LocationId, cancellationToken))
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    LocationErrors.CodeNotUnique.Code,
                    LocationErrors.CodeNotUnique.Description));
                continue;
            }

            entity.Name = item.Name.Trim();
            entity.Code = code;
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

        return new BatchUpdateLocationsResponse(updated, failures);
    }
}

internal sealed class BatchUpdateLocationsCommandValidator : AbstractValidator<BatchUpdateLocationsCommand>
{
    public BatchUpdateLocationsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.LocationId).GreaterThan(0);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        });
    }
}
