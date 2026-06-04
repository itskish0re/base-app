using Domain.Transactions;
using Gridify;

namespace Infrastructure.Gridify;

internal static class TransactionGridifyMappers
{
    public static readonly IGridifyMapper<BillListRow> Bill = new GridifyMapper<BillListRow>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.BillNumber,
            x => x.FromLocationName,
            x => x.TruckNumber,
            x => x.NameBoardName,
            x => x.DriverName,
            x => x.DriverMobile);

    public static readonly IGridifyMapper<LoadListRow> Load = new GridifyMapper<LoadListRow>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.BillNumber,
            x => x.ConsignorName,
            x => x.ConsigneeName,
            x => x.ToLocationName,
            x => x.GoodsName,
            x => x.UnitName);
}
