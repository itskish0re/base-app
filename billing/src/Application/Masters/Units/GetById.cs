using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Units;

public sealed record GetUnitByIdQuery(int UnitId) : IQuery<UnitResponse>;

internal sealed class GetUnitByIdQueryHandler(IUnitRepository repository)
    : IQueryHandler<GetUnitByIdQuery, UnitResponse>
{
    public async Task<Result<UnitResponse>> Handle(
        GetUnitByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.Unit? entity = await repository.GetByIdAsync(request.UnitId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<UnitResponse>(UnitErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
