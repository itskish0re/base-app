using Application.Abstractions.Messaging;
using Domain.Masters;
using SharedKernel;

namespace Application.Masters.Parties;

public sealed record GetPartyByIdQuery(int PartyId) : IQuery<PartyResponse>;

internal sealed class GetPartyByIdQueryHandler(IPartyRepository repository)
    : IQueryHandler<GetPartyByIdQuery, PartyResponse>
{
    public async Task<Result<PartyResponse>> Handle(
        GetPartyByIdQuery request,
        CancellationToken cancellationToken)
    {
        Domain.Masters.Party? entity = await repository.GetByIdAsync(request.PartyId, cancellationToken);

        if (entity is null)
        {
            return Result.Failure<PartyResponse>(PartyErrors.NotFound);
        }

        return entity.ToResponse();
    }
}
