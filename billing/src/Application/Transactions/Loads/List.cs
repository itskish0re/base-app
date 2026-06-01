using Application.Abstractions.Context;
using Application.Abstractions.Messaging;
using Domain.Transactions;
using FluentValidation;
using SharedKernel;

namespace Application.Transactions.Loads;

public sealed record ListLoadsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedLoadsResponse>;

internal sealed class ListLoadsQueryHandler(
    ILoadRepository repository,
    IFinancialYearContext financialYearContext)
    : IQueryHandler<ListLoadsQuery, PagedLoadsResponse>
{
    public async Task<Result<PagedLoadsResponse>> Handle(
        ListLoadsQuery request,
        CancellationToken cancellationToken)
    {
        Result<int> financialYearId = FinancialYearRequest.Require(financialYearContext);
        if (financialYearId.IsFailure)
        {
            return Result.Failure<PagedLoadsResponse>(financialYearId.Error);
        }

        LoadListResult result = await repository.ListAsync(
            new LoadListCriteria(
                financialYearId.Value,
                request.Filter,
                request.OrderBy,
                request.Page,
                request.PageSize),
            cancellationToken);

        IReadOnlyList<LoadListRowResponse> items = result.Items.Select(x => x.ToListResponse()).ToList();

        return new PagedLoadsResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListLoadsQueryValidator : AbstractValidator<ListLoadsQuery>
{
    public ListLoadsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
