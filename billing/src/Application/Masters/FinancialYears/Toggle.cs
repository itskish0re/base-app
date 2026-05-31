using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.FinancialYears;

public sealed record BatchToggleFinancialYearsCommand(IReadOnlyList<ToggleFinancialYearItem> Items)
    : ICommand<BatchToggleFinancialYearsResponse>;

internal sealed class BatchToggleFinancialYearsCommandHandler(
    IFinancialYearRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchToggleFinancialYearsCommand, BatchToggleFinancialYearsResponse>
{
    public async Task<Result<BatchToggleFinancialYearsResponse>> Handle(
        BatchToggleFinancialYearsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<FinancialYearResponse>();
        var failures = new List<BatchFinancialYearItemFailure>();
        var idsInBatch = new HashSet<int>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            ToggleFinancialYearItem item = request.Items[index];

            if (!idsInBatch.Add(item.FinancialYearId))
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    "FinancialYear.DuplicateId",
                    "Duplicate id in request batch."));
                continue;
            }

            Domain.Masters.FinancialYear? entity = await repository.GetByIdAsync(item.FinancialYearId, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    FinancialYearErrors.NotFound.Code,
                    FinancialYearErrors.NotFound.Description));
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

        return new BatchToggleFinancialYearsResponse(updated, failures);
    }
}

internal sealed class BatchToggleFinancialYearsCommandValidator : AbstractValidator<BatchToggleFinancialYearsCommand>
{
    public BatchToggleFinancialYearsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.FinancialYearId).GreaterThan(0);
        });
    }
}
