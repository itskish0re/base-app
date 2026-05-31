using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.FinancialYears;

public sealed record GetFinancialYearByIdQuery(int FinancialYearId) : IQuery<FinancialYearResponse>;

internal sealed class GetFinancialYearByIdQueryHandler(IFinancialYearRepository repository)
    : IQueryHandler<GetFinancialYearByIdQuery, FinancialYearResponse>
{
    public async Task<Result<FinancialYearResponse>> Handle(
        GetFinancialYearByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.FinancialYear? entity = await repository.GetByIdAsync(request.FinancialYearId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<FinancialYearResponse>(FinancialYearErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
