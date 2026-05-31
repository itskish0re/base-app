using Domain.Masters;
using Gridify;

namespace Infrastructure.Gridify;

internal static class MasterGridifyMappers
{
    public static readonly IGridifyMapper<NameBoard> NameBoard = new GridifyMapper<NameBoard>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Code,
            x => x.OwnerName,
            x => x.OwnerPhone);

    public static readonly IGridifyMapper<Truck> Truck = new GridifyMapper<Truck>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.TruckNumber,
            x => x.NameBoard!.Name,
            x => x.NameBoard!.Code);

    public static readonly IGridifyMapper<Location> Location = new GridifyMapper<Location>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Code);

    public static readonly IGridifyMapper<Party> Party = new GridifyMapper<Party>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Code);

    public static readonly IGridifyMapper<Goods> Goods = new GridifyMapper<Goods>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Code);

    public static readonly IGridifyMapper<Unit> Unit = new GridifyMapper<Unit>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Code);

    public static readonly IGridifyMapper<FinancialYear> FinancialYear = new GridifyMapper<FinancialYear>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Code);
}
