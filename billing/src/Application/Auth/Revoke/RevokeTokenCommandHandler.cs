using Application.Abstractions.Authentication;
using Application.Abstractions.Messaging;
using SharedKernel;
using Domain.Auth;

namespace Application.Auth.Revoke;

internal sealed class RevokeTokenCommandHandler(
    IUserContext userContext,
    IRefreshTokenRepository refreshTokenRepository) : ICommandHandler<RevokeTokenCommand>
{
    public async Task<Result> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        if (userContext.UserId is not int userId)
        {
            return Result.Failure(Error.Problem("Auth.Unauthorized", "User is not authenticated."));
        }

        await refreshTokenRepository.RevokeAllForUserAsync(userId, cancellationToken);

        return Result.Success();
    }
}
