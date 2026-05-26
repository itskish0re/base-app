using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Driver;

public sealed record GetDriverByIdQuery(int DriverId) : IQuery<DriverResponse>;

internal sealed class GetDriverByIdQueryHandler(IDriverRepository driverRepository)
    : IQueryHandler<GetDriverByIdQuery, DriverResponse>
{
    public async Task<Result<DriverResponse>> Handle(
        GetDriverByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.Driver? entity = await driverRepository.GetByIdAsync(request.DriverId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<DriverResponse>(DriverErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
