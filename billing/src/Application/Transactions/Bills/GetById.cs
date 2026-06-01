using Application.Abstractions.Context;
using Application.Abstractions.Messaging;
using Domain.Transactions;
using FluentValidation;
using SharedKernel;

namespace Application.Transactions.Bills;

public sealed record GetBillByIdQuery(int BillId) : IQuery<BillDetailResponse>;

internal sealed class GetBillByIdQueryHandler(
    IBillRepository billRepository,
    ILoadRepository loadRepository,
    IFinancialYearContext financialYearContext)
    : IQueryHandler<GetBillByIdQuery, BillDetailResponse>
{
    public async Task<Result<BillDetailResponse>> Handle(
        GetBillByIdQuery request,
        CancellationToken cancellationToken)
    {
        Result<int> financialYearId = FinancialYearRequest.Require(financialYearContext);
        if (financialYearId.IsFailure)
        {
            return Result.Failure<BillDetailResponse>(financialYearId.Error);
        }

        Bill? bill = await billRepository.GetByIdAsync(request.BillId, includeLoads: false, cancellationToken);
        if (bill is null || bill.FinancialYearId != financialYearId.Value)
        {
            return Result.Failure<BillDetailResponse>(BillErrors.NotFound);
        }

        IReadOnlyList<Load> loads = await loadRepository.GetActiveByBillIdAsync(request.BillId, cancellationToken);

        return new BillDetailResponse(
            bill.ToResponse(),
            loads.Select(x => x.ToLineResponse()).ToList());
    }
}

internal sealed class GetBillByIdQueryValidator : AbstractValidator<GetBillByIdQuery>
{
    public GetBillByIdQueryValidator()
    {
        RuleFor(x => x.BillId).GreaterThan(0);
    }
}
