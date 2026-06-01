using Application.Abstractions.Context;
using Application.Abstractions.Messaging;
using Domain.Transactions;
using FluentValidation;
using SharedKernel;

namespace Application.Transactions.Bills;

public sealed record ListBillsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedBillsResponse>;

internal sealed class ListBillsQueryHandler(
    IBillRepository repository,
    IFinancialYearContext financialYearContext)
    : IQueryHandler<ListBillsQuery, PagedBillsResponse>
{
    public async Task<Result<PagedBillsResponse>> Handle(
        ListBillsQuery request,
        CancellationToken cancellationToken)
    {
        Result<int> financialYearId = FinancialYearRequest.Require(financialYearContext);
        if (financialYearId.IsFailure)
        {
            return Result.Failure<PagedBillsResponse>(financialYearId.Error);
        }

        BillListResult result = await repository.ListAsync(
            new BillListCriteria(
                financialYearId.Value,
                request.Filter,
                request.OrderBy,
                request.Page,
                request.PageSize),
            cancellationToken);

        IReadOnlyList<BillListRowResponse> items = result.Items.Select(x => x.ToListResponse()).ToList();

        return new PagedBillsResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListBillsQueryValidator : AbstractValidator<ListBillsQuery>
{
    public ListBillsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
