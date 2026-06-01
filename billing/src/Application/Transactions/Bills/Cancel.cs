using Application.Abstractions.Authentication;
using Application.Abstractions.Context;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Transactions;
using FluentValidation;
using SharedKernel;

namespace Application.Transactions.Bills;

public sealed record CancelBillCommand(int BillId) : ICommand<CancelBillResponse>;

internal sealed class CancelBillCommandHandler(
    IBillRepository repository,
    IUnitOfWork unitOfWork,
    IFinancialYearContext financialYearContext,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider)
    : ICommandHandler<CancelBillCommand, CancelBillResponse>
{
    public async Task<Result<CancelBillResponse>> Handle(
        CancelBillCommand request,
        CancellationToken cancellationToken)
    {
        Result<int> financialYearId = FinancialYearRequest.Require(financialYearContext);
        if (financialYearId.IsFailure)
        {
            return Result.Failure<CancelBillResponse>(financialYearId.Error);
        }

        Bill? bill = await repository.GetByIdForUpdateAsync(request.BillId, cancellationToken);
        if (bill is null || bill.FinancialYearId != financialYearId.Value)
        {
            return Result.Failure<CancelBillResponse>(BillErrors.NotFound);
        }

        bill.IsCancelled = true;
        bill.UpdatedAt = dateTimeProvider.UtcNow;
        bill.UpdatedBy = userContext.UserId;

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new CancelBillResponse(bill.ToResponse());
    }
}

internal sealed class CancelBillCommandValidator : AbstractValidator<CancelBillCommand>
{
    public CancelBillCommandValidator()
    {
        RuleFor(x => x.BillId).GreaterThan(0);
    }
}
