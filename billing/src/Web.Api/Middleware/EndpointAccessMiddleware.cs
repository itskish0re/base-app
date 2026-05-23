using Web.Api.Authorization;
using Application.Abstractions.Authentication;
using Domain.Access;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace Web.Api.Middleware;

internal sealed class EndpointAccessMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(
        HttpContext context,
        IUserContext userContext,
        EndpointAccessCache endpointAccessCache,
        IEndpointAccessRepository endpointAccessRepository)
    {
        Endpoint? endpoint = context.GetEndpoint();
        EndpointAccessAttribute? attribute = endpoint?.Metadata.GetMetadata<EndpointAccessAttribute>();

        if (attribute is null)
        {
            await next(context);
            return;
        }

        IReadOnlyList<EndpointAccessRule> rules = await endpointAccessCache.GetRulesAsync(context.RequestAborted);
        EndpointAccessRule? rule = rules.FirstOrDefault(r =>
            string.Equals(r.EndpointCode, attribute.EndpointCode, StringComparison.OrdinalIgnoreCase));

        if (rule is null)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }

        if (string.Equals(rule.AccessMode, "public", StringComparison.OrdinalIgnoreCase))
        {
            await next(context);
            return;
        }

        if (string.Equals(rule.AccessMode, "anon", StringComparison.OrdinalIgnoreCase))
        {
            if (userContext.IsAuthenticated)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            await next(context);
            return;
        }

        if (!userContext.IsAuthenticated || userContext.RoleId is not int roleId)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        bool allowed = await endpointAccessRepository.IsAllowedAsync(roleId, attribute.EndpointCode, context.RequestAborted);

        if (!allowed)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }

        await next(context);
    }
}
