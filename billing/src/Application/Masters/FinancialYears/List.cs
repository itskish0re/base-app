using Application.Abstractions.Messaging;
using Domain.Masters;
using FluentValidation;
using SharedKernel;

namespace Application.Masters.FinancialYears;

public sealed record ListFinancialYearsQuery(
    string? Filter,
    string? OrderBy,
    int Page = 1,
    int PageSize = 20) : IQuery<PagedFinancialYearsResponse>;

internal sealed class ListFinancialYearsQueryHandler(IFinancialYearRepository repository)
    : IQueryHandler<ListFinancialYearsQuery, PagedFinancialYearsResponse>
{
    public async Task<Result<PagedFinancialYearsResponse>> Handle(
        ListFinancialYearsQuery request,
        CancellationToken cancellationToken)
    {
        FinancialYearListResult result = await repository.ListAsync(
            new FinancialYearListCriteria(request.Filter, request.OrderBy, request.Page, request.PageSize),
            cancellationToken);

        IReadOnlyList<FinancialYearResponse> items = result.Items.Select(x => x.ToResponse()).ToList();

        return new PagedFinancialYearsResponse(items, request.Page, request.PageSize, result.TotalCount);
    }
}

internal sealed class ListFinancialYearsQueryValidator : AbstractValidator<ListFinancialYearsQuery>
{
    public ListFinancialYearsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
