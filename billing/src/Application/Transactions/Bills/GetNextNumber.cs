using Application.Abstractions.Context;
using Application.Abstractions.Messaging;
using Domain.Transactions;
using SharedKernel;

namespace Application.Transactions.Bills;

public sealed record GetNextBillNumberQuery : IQuery<NextBillNumberResponse>;

internal sealed class GetNextBillNumberQueryHandler(
    IBillRepository repository,
    IFinancialYearContext financialYearContext)
    : IQueryHandler<GetNextBillNumberQuery, NextBillNumberResponse>
{
    public async Task<Result<NextBillNumberResponse>> Handle(
        GetNextBillNumberQuery request,
        CancellationToken cancellationToken)
    {
        Result<int> financialYearId = FinancialYearRequest.Require(financialYearContext);
        if (financialYearId.IsFailure)
        {
            return Result.Failure<NextBillNumberResponse>(financialYearId.Error);
        }

        string? last = await repository.GetLastBillNumberAsync(financialYearId.Value, cancellationToken);
        string next = BillNumberSuggestion.SuggestNext(last);

        return new NextBillNumberResponse(next);
    }
}
