using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Locations;

public sealed record GetLocationByIdQuery(int LocationId) : IQuery<LocationResponse>;

internal sealed class GetLocationByIdQueryHandler(ILocationRepository repository)
    : IQueryHandler<GetLocationByIdQuery, LocationResponse>
{
    public async Task<Result<LocationResponse>> Handle(
        GetLocationByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.Location? entity = await repository.GetByIdAsync(request.LocationId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<LocationResponse>(LocationErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
