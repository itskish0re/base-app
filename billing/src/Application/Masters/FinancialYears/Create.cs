using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.FinancialYears;

public sealed record BatchCreateFinancialYearsCommand(IReadOnlyList<CreateFinancialYearItem> Items)
    : ICommand<BatchCreateFinancialYearsResponse>;

internal sealed class BatchCreateFinancialYearsCommandHandler(
    IFinancialYearRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchCreateFinancialYearsCommand, BatchCreateFinancialYearsResponse>
{
    public async Task<Result<BatchCreateFinancialYearsResponse>> Handle(
        BatchCreateFinancialYearsCommand request,
        CancellationToken cancellationToken)
    {
        var entities = new List<Domain.Masters.FinancialYear>();
        var failures = new List<BatchFinancialYearItemFailure>();
        var codesInBatch = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Items.Count; index++)
        {
            CreateFinancialYearItem item = request.Items[index];
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

            if (await repository.ExistsByCodeAsync(code, excludeId: null, cancellationToken))
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    FinancialYearErrors.CodeNotUnique.Code,
                    FinancialYearErrors.CodeNotUnique.Description));
                continue;
            }

            var entity = new Domain.Masters.FinancialYear
            {
                Code = code,
                Name = FinancialYearFormatting.FormatNameFromCode(code),
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

        IReadOnlyList<FinancialYearResponse> created = entities.Select(x => x.ToResponse()).ToList();

        return new BatchCreateFinancialYearsResponse(created, failures);
    }
}

internal sealed class BatchCreateFinancialYearsCommandValidator : AbstractValidator<BatchCreateFinancialYearsCommand>
{
    public BatchCreateFinancialYearsCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleFor(x => x.Items.Count).LessThanOrEqualTo(100);

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.Code).NotEmpty().MaximumLength(64);
        });
    }
}
