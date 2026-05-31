using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.GoodsItems;

public sealed record GetGoodsByIdQuery(int GoodsId) : IQuery<GoodsResponse>;

internal sealed class GetGoodsByIdQueryHandler(IGoodsRepository repository)
    : IQueryHandler<GetGoodsByIdQuery, GoodsResponse>
{
    public async Task<Result<GoodsResponse>> Handle(
        GetGoodsByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.Goods? entity = await repository.GetByIdAsync(request.GoodsId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<GoodsResponse>(GoodsErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
