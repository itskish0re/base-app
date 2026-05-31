using Application.Masters.NameBoard;
using Application.Masters.Truck;
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
        config.NewConfig<Domain.Masters.NameBoard, NameBoardResponse>();

        config.NewConfig<Truck, TruckResponse>()
            .Map(dest => dest.NameBoardId, src => src.NameBoardId)
            .Map(dest => dest.NameBoardCode, src => src.NameBoard != null ? src.NameBoard.Code : null)
            .Map(dest => dest.NameBoardName, src => src.NameBoard != null ? src.NameBoard.Name : null);
    }
}
