using Domain.Access;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Authentication;

public sealed class EndpointAccessCache(
    IEndpointAccessRepository repository,
    IMemoryCache memoryCache)
{
    private const string CacheKey = "endpoint-access-rules";

    public async Task<IReadOnlyList<EndpointAccessRule>> GetRulesAsync(CancellationToken cancellationToken)
    {
        return await memoryCache.GetOrCreateAsync(CacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return await repository.GetAllActiveAsync(cancellationToken);
        }) ?? [];
    }

    public void Invalidate() => memoryCache.Remove(CacheKey);
}
