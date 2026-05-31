using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.Units;

public sealed record BatchCreateUnitsCommand(IReadOnlyList<CreateUnitItem> Items)
    : ICommand<BatchCreateUnitsResponse>;

internal sealed class BatchCreateUnitsCommandHandler(
    IUnitRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateUnitsCommand, BatchCreateUnitsResponse>
{
    public async Task<Result<BatchCreateUnitsResponse>> Handle(
        BatchCreateUnitsCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.Unit>();
        var failures = new List<BatchUnitItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateUnitItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    UnitErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
                continue;
            }

            if (await repository.ExistsByCodeAsync(code, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchUnitItemFailure(
                    index,
                    UnitErrors.CodeNotUnique.Code,
                    UnitErrors.CodeNotUnique.Description));
                continue;
            }

            var entity = new Domain.Masters.Unit
            {
                Name = item.Name.Trim(),
                Code = code,
                IsFixed = item.IsFixed,
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

        IReadOnlyList<UnitResponse> created = entities.Select(x => x.ToResponse()).ToList();

        return new BatchCreateUnitsResponse(created, failures);
    }
}

internal sealed class BatchCreateUnitsCommandValidator : AbstractValidator<BatchCreateUnitsCommand>
{
    public BatchCreateUnitsCommandValidator()
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
