namespace Application.Masters.FinancialYears;

internal static class FinancialYearMappings
{
    public static FinancialYearResponse ToResponse(this Domain.Masters.FinancialYear entity) =>
        new(
            entity.FinancialYearId,
            entity.Code,
            entity.Name,
            entity.IsEnabled,
            entity.IsActive,
            entity.CreatedAt,
            entity.UpdatedAt);
}
