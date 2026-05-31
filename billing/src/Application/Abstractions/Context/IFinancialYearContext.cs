namespace Application.Abstractions.Context;

/// <summary>
/// Optional financial year selected by the client (transaction scoping).
/// Populated from the <c>X-Financial-Year-Id</c> request header when present.
/// </summary>
public interface IFinancialYearContext
{
    int? FinancialYearId { get; }
}
