using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Locations;

public sealed record BatchCreateLocationsCommand(IReadOnlyList<CreateLocationItem> Items)
    : ICommand<BatchCreateLocationsResponse>;

internal sealed class BatchCreateLocationsCommandHandler(
    ILocationRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateLocationsCommand, BatchCreateLocationsResponse>
{
    public async Task<Result<BatchCreateLocationsResponse>> Handle(
        BatchCreateLocationsCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.Location>();
        var failures = new List<BatchLocationItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateLocationItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    LocationErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
                continue;
            }

            if (await repository.ExistsByCodeAsync(code, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchLocationItemFailure(
                    index,
                    LocationErrors.CodeNotUnique.Code,
                    LocationErrors.CodeNotUnique.Description));
                continue;
            }

            var entity = new Domain.Masters.Location
            {
                Name = item.Name.Trim(),
                Code = code,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            repository.Add(entity);
            entities.Add(entity);
        }

        if (entities.Count > 0)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        IReadOnlyList<LocationResponse> created = entities.Select(x => x.ToResponse()).ToList();

        return new BatchCreateLocationsResponse(created, failures);
    }
}

internal sealed class BatchCreateLocationsCommandValidator : AbstractValidator<BatchCreateLocationsCommand>
{
    public BatchCreateLocationsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
            item.RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        });
    }
}
