using Application.Abstractions.Authentication;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.FinancialYears;

public sealed record BatchDeleteFinancialYearsCommand(IReadOnlyList<int> Ids) : ICommand<BatchDeleteFinancialYearsResponse>;

internal sealed class BatchDeleteFinancialYearsCommandHandler(
    IFinancialYearRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider) : ICommandHandler<BatchDeleteFinancialYearsCommand, BatchDeleteFinancialYearsResponse>
{
    public async Task<Result<BatchDeleteFinancialYearsResponse>> Handle(
        BatchDeleteFinancialYearsCommand request,
        CancellationToken cancellationToken)
    {
        var deletedIds = new List<int>();
        var failures = new List<BatchFinancialYearItemFailure>();
        DateTime utcNow = dateTimeProvider.UtcNow;

        for (int index = 0; index < request.Ids.Count; index++)
        {
            int id = request.Ids[index];
            Domain.Masters.FinancialYear? entity = await repository.GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                failures.Add(new BatchFinancialYearItemFailure(
                    index,
                    FinancialYearErrors.NotFound.Code,
                    FinancialYearErrors.NotFound.Description));
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

        return new BatchDeleteFinancialYearsResponse(deletedIds, failures);
    }
}

internal sealed class BatchDeleteFinancialYearsCommandValidator : AbstractValidator<BatchDeleteFinancialYearsCommand>
{
    public BatchDeleteFinancialYearsCommandValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().WithMessage("At least one id is required.");
        RuleFor(x => x.Ids.Count).LessThanOrEqualTo(100);
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}
