namespace Domain.Access;

public interface IEndpointAccessRepository
{
    Task<IReadOnlyList<EndpointAccessRule>> GetAllActiveAsync(CancellationToken cancellationToken = default);

    Task<bool> IsAllowedAsync(int roleId, string endpointCode, CancellationToken cancellationToken = default);
}

public sealed record EndpointAccessRule(
    string EndpointCode,
    string HttpMethod,
    string RoutePattern,
    string AccessMode,
    bool IsActive);
