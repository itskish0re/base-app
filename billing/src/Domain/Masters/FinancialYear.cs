using Domain.Platform;

namespace Domain.Masters;

public sealed class FinancialYear : AuditableEntity
{
    public int FinancialYearId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;
}
