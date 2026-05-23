using Application.Masters;
using Domain.Masters;
using Mapster;

namespace Application.Mappings;

/// <summary>
/// Mapster profiles for master entities (domain navigation models → API/DTO shapes).
/// </summary>
public sealed class MasterMappingRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<NameBoard, NameBoardResponse>();

        config.NewConfig<Truck, TruckResponse>()
            .Map(dest => dest.NameBoardId, src => src.NameBoardId)
            .Map(dest => dest.NameBoardCode, src => src.NameBoard != null ? src.NameBoard.Code : null);

        config.NewConfig<Driver, DriverResponse>()
            .Map(dest => dest.TruckId, src => src.TruckId)
            .Map(dest => dest.TruckNumber, src => src.Truck != null ? src.Truck.TruckNumber : null);
    }
}
