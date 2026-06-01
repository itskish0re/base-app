using Domain.Transactions;

namespace Application.Transactions.Bills;

internal static class BillMappings
{
    public static BillResponse ToResponse(this Bill entity) =>
        new(
            entity.BillId,
            entity.BillNumber,
            entity.BillDate,
            entity.FromId,
            entity.TruckId,
            entity.DriverName,
            entity.DriverMobile,
            entity.TotalFreight,
            entity.Commission,
            entity.Crossing,
            entity.HandLoan,
            entity.TruckLoan,
            entity.OfficeMamul,
            entity.TapalMamul,
            entity.Diesel,
            entity.Others,
            entity.Total,
            entity.IsCancelled,
            entity.FinancialYearId,
            entity.CreatedAt,
            entity.UpdatedAt);

    public static LoadLineResponse ToLineResponse(this Load entity) =>
        new(
            entity.LoadId,
            entity.BillId,
            entity.LoadNumber,
            entity.PartyId,
            entity.ToId,
            entity.GoodsId,
            entity.UnitId,
            entity.WeightOrQuantity,
            entity.RatePerUnit,
            entity.Freight,
            entity.Advance,
            entity.Topay,
            entity.Balance,
            entity.IsActive,
            entity.FinancialYearId);

    public static BillListRowResponse ToListResponse(this BillListRow row) =>
        new(
            row.BillId,
            row.BillNumber,
            row.BillDate,
            row.FromId,
            row.FromLocationName,
            row.TruckId,
            row.TruckNumber,
            row.NameBoardName,
            row.OwnerName,
            row.OwnerMobile,
            row.DriverName,
            row.DriverMobile,
            row.TotalFreight,
            row.Commission,
            row.Crossing,
            row.HandLoan,
            row.TruckLoan,
            row.OfficeMamul,
            row.TapalMamul,
            row.Diesel,
            row.Others,
            row.Total,
            row.IsCancelled,
            row.FinancialYearId);
}
