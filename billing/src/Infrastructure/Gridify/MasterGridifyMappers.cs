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

    public static readonly IGridifyMapper<Driver> Driver = new GridifyMapper<Driver>()
        .AddCompositeMap(
            GridifyListFilter.GlobalSearchField,
            x => x.Name,
            x => x.Mobile,
            x => x.Truck!.TruckNumber);
}
