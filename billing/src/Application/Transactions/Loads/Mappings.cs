using Domain.Transactions;

namespace Application.Transactions.Loads;

internal static class LoadMappings
{
    public static LoadListRowResponse ToListResponse(this LoadListRow row) =>
        new(
            row.LoadId,
            row.BillId,
            row.BillNumber,
            row.LoadNumber,
            row.PartyId,
            row.PartyName,
            row.ToId,
            row.ToLocationName,
            row.GoodsId,
            row.GoodsName,
            row.UnitId,
            row.UnitName,
            row.WeightOrQuantity,
            row.RatePerUnit,
            row.Freight,
            row.Advance,
            row.Topay,
            row.Balance,
            row.IsActive,
            row.FinancialYearId);
}
