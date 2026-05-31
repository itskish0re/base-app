using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.FinancialYears;

public sealed record BatchUpdateFinancialYearsCommand(IReadOnlyList<UpdateFinancialYearItem> Items)
    : ICommand<BatchUpdateFinancialYearsResponse>;

internal sealed class BatchUpdateFinancialYearsCommandHandler(
    IFinancialYearRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchUpdateFinancialYearsCommand, BatchUpdateFinancialYearsResponse>
{
    public async Task<Result<BatchUpdateFinancialYearsResponse>> Handle(
        BatchUpdateFinancialYearsCommand request,
        CancellationToken cancellationToken)
    {
        var updated = new List<FinancialYearResponse>();
        var failures = new List<BatchFinancialYearItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            UpdateFinancialYearItem item = request.Items[index];
            string code = item.Code.Trim();

            if (!FinancialYearFormatting.TryParseYearCode(code, out _))
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    FinancialYearErrors.InvalidYearCode.Code,
                    FinancialYearErrors.InvalidYearCode.Description));
                continue;
            }

            if (!codesInBatch.Add(code))
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    FinancialYearErrors.CodeNotUnique.Code,
                    "Duplicate code in request batch."));
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

            if (await repository.ExistsByCodeAsync(code, item.FinancialYearId, cancellationToken))
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    FinancialYearErrors.CodeNotUnique.Code,
                    FinancialYearErrors.CodeNotUnique.Description));
                continue;
            }

            entity.Code = code;
            entity.Name = FinancialYearFormatting.FormatNameFromCode(code);
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

        return new BatchUpdateFinancialYearsResponse(updated, failures);
    }
}

internal sealed class BatchUpdateFinancialYearsCommandValidator : AbstractValidator<BatchUpdateFinancialYearsCommand>
{
    public BatchUpdateFinancialYearsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.FinancialYearId).GreaterThan(0);
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
        });
    }
}
