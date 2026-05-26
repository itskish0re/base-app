using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Truck;

public sealed record GetTruckByIdQuery(int TruckId) : IQuery<TruckResponse>;

internal sealed class GetTruckByIdQueryHandler(ITruckRepository truckRepository)
    : IQueryHandler<GetTruckByIdQuery, TruckResponse>
{
    public async Task<Result<TruckResponse>> Handle(
        GetTruckByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.Truck? entity = await truckRepository.GetByIdAsync(request.TruckId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<TruckResponse>(TruckErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
